import socketService from '../../services/socket';
import { apiSlice } from './apiSlice';

const normalizeId = (value: any): string | undefined => {
    if (value === undefined || value === null) return undefined;
    return String(value);
};

const resolveEntityId = (entity: any): string | undefined => {
    return normalizeId(
        entity?.userId ??
        entity?._id ??
        entity?.id ??
        entity?.user?.userId ??
        entity?.user?._id ??
        entity?.user?.id
    );
};

const resolveMessageSideId = (value: any): string | undefined => {
    if (value && typeof value === 'object') {
        return resolveEntityId(value);
    }
    return normalizeId(value);
};

export const chatApiSlice = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getConversations: builder.query<any, string | undefined>({
            query: () => '/messages/conversations',
            transformResponse: (response: { data: any[] }) => {
                console.log('Conversations Response:', JSON.stringify(response.data, null, 2));
                return response.data;
            },
            providesTags: ['Chat'],
            async onCacheEntryAdded(
                arg,
                { dispatch, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    await cacheDataLoaded;
                    const socket = socketService.getSocket();
                    if (!socket) return;

                    const listener = (event: any) => {
                        dispatch(apiSlice.util.invalidateTags(['Chat']));
                    };
                    socket.on('new_message', listener);
                    await cacheEntryRemoved;
                    socket.off('new_message', listener);
                } catch {
                }
            },
        }),
        getMessages: builder.query<any, string>({
            query: (partnerId) => `/messages/conversation/${partnerId}`,
            transformResponse: (response: { data: any[] }) => {
                console.log('Messages Response:', JSON.stringify(response.data, null, 2));
                return response.data;
            },
            providesTags: (result, error, partnerId) => [{ type: 'Chat', id: partnerId }],
            async onCacheEntryAdded(
                partnerId,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState }
            ) {
                try {
                    await cacheDataLoaded;
                    const socket = socketService.getSocket();
                    if (!socket) return;

                    const listener = (newMessage: any) => {
                        console.log('New message received via socket:', newMessage.id || newMessage._id);
                        const senderId = resolveMessageSideId(newMessage.senderId ?? newMessage.sender);
                        const receiverIdFromMsg = resolveMessageSideId(newMessage.receiverId ?? newMessage.receiver);
                        const partnerKey = normalizeId(partnerId);
                        const state = getState() as any;
                        const myId = resolveEntityId(state?.auth?.user);

                        const isRelevant = !!partnerKey && (
                            myId
                                ? (
                                    (senderId === partnerKey && receiverIdFromMsg === myId) ||
                                    (senderId === myId && receiverIdFromMsg === partnerKey)
                                )
                                : (senderId === partnerKey || receiverIdFromMsg === partnerKey)
                        );

                        if (isRelevant) {
                            updateCachedData((draft) => {
                                // Check if message already exists to avoid duplicates (e.g. from optimistic updates)
                                const incomingId = normalizeId(newMessage._id || newMessage.id);
                                const exists = draft.some((m: any) => normalizeId(m._id || m.id) === incomingId);
                                if (!exists) {
                                    draft.push(newMessage);
                                }
                            });
                        }
                    };

                    socket.on('new_message', listener);

                    await cacheEntryRemoved;
                    socket.off('new_message', listener);
                } catch {
                }
            },
        }),
        sendMessage: builder.mutation<any, { receiverId: string; messageText: string }>({
            query: (body) => {
                console.log('Sending message body:', body);
                return {
                    url: '/messages',
                    method: 'POST',
                    body,
                };
            },
            async onQueryStarted({ receiverId, messageText }, { dispatch, queryFulfilled, getState }) {
                // Optimistic Update
                const state = getState() as any;
                const currentUser = state.auth.user;
                const currentUserId = resolveEntityId(currentUser) || '';
                console.log('SendMessage onQueryStarted - senderId:', currentUserId);
                const tempId = Date.now().toString();

                const optimisitcMessage = {
                    id: tempId,
                    _id: tempId,
                    receiverId,
                    messageText,
                    senderId: currentUserId,
                    sender: currentUserId,
                    createdAt: new Date().toISOString(),
                    isOptimistic: true,
                };

                const patchResult = dispatch(
                    chatApiSlice.util.updateQueryData('getMessages', receiverId, (draft) => {
                        draft.push(optimisitcMessage);
                    })
                );

                try {
                    await queryFulfilled;
                    // Invalidate to get the real message with server ID or let socket handle it
                    // dispatch(apiSlice.util.invalidateTags(['Chat']));
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ['Chat'],
        }),
        markAsRead: builder.mutation<void, string>({
            query: (messageId) => ({
                url: `/messages/${messageId}/read`,
                method: 'PATCH',
            }),
        }),
    }),
});

export const {
    useGetConversationsQuery,
    useGetMessagesQuery,
    useSendMessageMutation,
    useMarkAsReadMutation,
} = chatApiSlice;
