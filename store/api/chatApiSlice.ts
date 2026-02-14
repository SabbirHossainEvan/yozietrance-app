import socketService from '../../services/socket';
import { apiSlice } from './apiSlice';

export const chatApiSlice = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getConversations: builder.query<any, void>({
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
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    await cacheDataLoaded;
                    const socket = socketService.getSocket();
                    if (!socket) return;

                    const listener = (newMessage: any) => {
                        console.log('New message received via socket:', newMessage.id || newMessage._id);
                        const senderId = newMessage.senderId || newMessage.sender;
                        const receiverIdFromMsg = newMessage.receiverId || newMessage.receiver;

                        // Only add if it's relevant to this conversation
                        if (senderId === partnerId || receiverIdFromMsg === partnerId) {
                            updateCachedData((draft) => {
                                // Check if message already exists to avoid duplicates (e.g. from optimistic updates)
                                const exists = draft.some((m: any) => (m._id || m.id) === (newMessage._id || newMessage.id));
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
                console.log('SendMessage onQueryStarted - senderId (currentUser.id):', currentUser?.id);
                const tempId = Date.now().toString();

                const optimisitcMessage = {
                    id: tempId,
                    _id: tempId,
                    receiverId,
                    messageText,
                    senderId: currentUser.id,
                    sender: currentUser.id,
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
