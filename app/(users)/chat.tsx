import { useGetConversationsQuery } from '@/store/api/chatApiSlice';
import { useGetMyConnectionsQuery } from '@/store/api/connectionApiSlice';
import { RootState } from '@/store/store';
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from 'react-redux';

export default function ChatScreen() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const currentUserId = user?.userId || user?.id || (user as any)?._id;
  const { data: conversationsData, isLoading: isConversationsLoading } = useGetConversationsQuery(currentUserId, {
    skip: !currentUserId,
    refetchOnMountOrArgChange: true,
  });
  const { data: connectionsData, isLoading: isConnectionsLoading } = useGetMyConnectionsQuery(currentUserId, {
    skip: !currentUserId,
    refetchOnMountOrArgChange: true,
  });
  console.log('Connections Data:', JSON.stringify(connectionsData, null, 2));

  const normalizeId = (value: any) => (value === undefined || value === null ? undefined : String(value));
  const getCandidateIds = (entity: any) =>
    [
      entity?.userId,
      entity?._id,
      entity?.id,
      entity?.user?.userId,
      entity?.user?._id,
      entity?.user?.id,
    ]
      .map(normalizeId)
      .filter(Boolean) as string[];
  const getPrimaryId = (entity: any) => getCandidateIds(entity)[0];
  const myIds = new Set([
    ...getCandidateIds(user),
    ...getCandidateIds((user as any)?.buyer),
    ...getCandidateIds((user as any)?.vendor),
  ]);

  const conversations = useMemo(() => {
    console.log('Calculating merged conversations...');
    const chatList = Array.isArray(conversationsData) ? [...conversationsData] : [];
    const connections = connectionsData?.data || [];
    console.log('Connections length:', connections.length);
    console.log('ChatList length before merge:', chatList.length);

    // Map conversation partner IDs
    const existingPartnerIds = new Set(
      chatList.map(conv => {
        const partner = conv.participant
          || conv.participants?.find((p: any) => !getCandidateIds(p).some((id) => myIds.has(id)))
          || conv.participants?.[0];
        return getPrimaryId(partner);
      }).filter(Boolean)
    );

    // Add connections that don't have a conversation yet
    connections.forEach((conn: any) => {
      const partner = conn.vendor || conn.user || conn.buyer;
      const partnerId = getPrimaryId(partner);
      if (partner && partnerId && !existingPartnerIds.has(partnerId)) {
        chatList.push({
          _id: partnerId,
          id: partnerId,
          participants: [partner],
          lastMessage: null,
          unreadCount: 0,
          isConnectionOnly: true,
          participant: partner
        });
      }
    });

    // Ensure every row has a stable key for FlatList rendering.
    return chatList.map((item: any, index: number) => {
      const participant = item.participant
        || item.participants?.find((p: any) => !getCandidateIds(p).some((id) => myIds.has(id)))
        || item.participants?.[0]
        || {};
      const partnerId = getPrimaryId(participant);
      const baseId = item.id || item._id || partnerId;
      const fallbackName = participant.storename || participant.name || participant.businessName || 'unknown';

      return {
        ...item,
        __key: String(baseId || `${fallbackName}-${index}`),
      };
    });
  }, [conversationsData, connectionsData, user]);

  const isLoading = isConversationsLoading || isConnectionsLoading;
  console.log('Merged Chat List Count:', conversations.length);

  const renderItem = ({ item }: { item: any }) => {
    const participant = item.participant
      || item.participants?.find((p: any) => !getCandidateIds(p).some((id) => myIds.has(id)))
      || item.participants?.[0]
      || {};

    console.log('Chat List Item:', {
      id: item.id || item._id || item.__key,
      participantName: participant.storename || participant.name || participant.businessName || 'Unknown',
      userId: participant.userId,
      profileId: participant._id || participant.id
    });
    return (
      <TouchableOpacity
        style={styles.chatCard}
        onPress={() => {
          const partnerId = getPrimaryId(participant);
          if (!partnerId) {
            console.warn('Missing partnerId for chat item:', item);
            return;
          }
          console.log('Navigating to ChatBox with partnerId:', partnerId, 'Vendor ID:', participant.id);
          router.push({
            pathname: "/chat_box",
            params: {
              conversationId: partnerId,
              partnerId: partnerId,
              fullname: participant.storename || participant.name || participant.fullName || participant.fulllName || 'Vendor'
            }
          })
        }}
      >

        <Image source={{ uri: participant.logoUrl || 'https://via.placeholder.com/50' }} style={styles.avatar} />
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <View>
              <Text style={styles.userName}>{participant?.businessName || participant?.fullName || participant?.vendorCode}</Text>
              {/* <Text style={{ fontSize: 10, color: '#2A8383', fontWeight: '500' }}>#{participant._id?.slice(-6).toUpperCase() || 'ID'}</Text> */}
            </View>
            <Text
              style={[
                styles.timeText,
                (item.unreadCount || 0) > 0 ? styles.activeTime : null,
              ]}
            >
              {item.lastMessage?.createdAt ? new Date(item.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </Text>
          </View>
          <View style={styles.chatFooter}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage?.text || 'No messages'}
            </Text>
            {(item.unreadCount || 0) > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput placeholder="Search" style={styles.searchInput} />
      </View>

      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={(item) => item.__key}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: '#888' }}>
              {isLoading ? 'Loading chats...' : 'No conversations yet. Connect with a vendor to start chatting!'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FBF9" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    margin: 16,
    borderRadius: 15,
    padding: 12,
    alignItems: "center",
    elevation: 2,
  },
  searchInput: { marginLeft: 10, flex: 1 },
  chatCard: {
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "#D1F2EB",
  },
  chatInfo: { flex: 1, marginLeft: 15, justifyContent: "center" },
  chatHeader: { flexDirection: "row", justifyContent: "space-between" },
  userName: { fontSize: 16, fontWeight: "600", color: "#333" },
  timeText: { fontSize: 12, color: "#999" },
  activeTime: { color: "#2A8383" },
  chatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  lastMessage: { fontSize: 14, color: "#777", flex: 1 },
  unreadBadge: {
    backgroundColor: "#2A8383",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
});
