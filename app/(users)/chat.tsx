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
  const { data: conversationsData, isLoading: isConversationsLoading } = useGetConversationsQuery();
  const { data: connectionsData, isLoading: isConnectionsLoading } = useGetMyConnectionsQuery();
  console.log('Connections Data:', JSON.stringify(connectionsData, null, 2));

  const conversations = useMemo(() => {
    console.log('Calculating merged conversations...');
    const chatList = Array.isArray(conversationsData) ? [...conversationsData] : [];
    const connections = connectionsData?.data || [];
    console.log('Connections length:', connections.length);
    console.log('ChatList length before merge:', chatList.length);

    // Map conversation partner IDs
    const existingPartnerIds = new Set(
      chatList.map(conv => {
        const partner = conv.participants?.find((p: any) => (p._id || p.id) !== user?.id)
          || conv.participant
          || conv.participants?.[0];
        return partner?.userId || partner?._id || partner?.id;
      }).filter(Boolean)
    );

    // Add connections that don't have a conversation yet
    connections.forEach((conn: any) => {
      const vendor = conn.vendor;
      const partnerId = vendor?.userId || vendor?._id || vendor?.id;
      if (vendor && partnerId && !existingPartnerIds.has(partnerId)) {
        chatList.push({
          _id: partnerId,
          id: partnerId,
          participants: [vendor],
          lastMessage: null,
          unreadCount: 0,
          isConnectionOnly: true,
          participant: vendor
        });
      }
    });

    return chatList;
  }, [conversationsData, connectionsData, user?.id, user?.userId]);

  const isLoading = isConversationsLoading || isConnectionsLoading;
  console.log('Merged Chat List Count:', conversations.length);

  const renderItem = ({ item }: { item: any }) => {
    const participant = item.participants?.find((p: any) => (p._id || p.id) !== user?.id)
      || item.participant
      || item.participants?.[0]
      || {};

    console.log('Chat List Item:', {
      id: item.id,
      participantName: participant.storename || participant.name || participant.businessName || 'Unknown',
      userId: participant.userId,
      profileId: participant._id || participant.id
    });
    return (
      <TouchableOpacity
        style={styles.chatCard}
        onPress={() => {
          const partnerId = participant.userId || participant._id || participant.id;
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
        keyExtractor={(item) => item.id || item._id}
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
