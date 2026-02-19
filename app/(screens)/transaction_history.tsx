import {
  useCreateAccountLinkMutation,
  useCreateVendorAccountMutation,
  useGetAllPaymentsQuery,
  useGetVendorAccountStatusQuery,
} from '@/store/api/paymentApiSlice';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { useFocusEffect, useRouter } from 'expo-router';
import { ArrowDownLeft, ChevronLeft, ChevronRight, Plus } from 'lucide-react-native';
import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransactionHistory() {
  const router = useRouter();
  const currentUser = useAppSelector(selectCurrentUser);
  const currentUserId = currentUser?.userId || currentUser?.id || (currentUser as any)?._id;
  const { data: paymentsData, isLoading, refetch } = useGetAllPaymentsQuery(currentUserId, {
    skip: !currentUserId,
    refetchOnMountOrArgChange: true,
  });
  const {
    data: stripeStatus,
    isLoading: isStripeStatusLoading,
    refetch: refetchStripeStatus,
  } = useGetVendorAccountStatusQuery(undefined);
  const [createVendorAccount, { isLoading: isCreatingStripeAccount }] = useCreateVendorAccountMutation();
  const [createAccountLink, { isLoading: isCreatingStripeLink }] = useCreateAccountLinkMutation();

  useFocusEffect(
    useCallback(() => {
      refetch();
      refetchStripeStatus();
    }, [refetch, refetchStripeStatus])
  );

  const userType = (currentUser?.userType || '').toLowerCase();

  // Collect possible IDs from mixed backend response shapes.
  const getCandidateIds = (entity: any): string[] => {
    if (!entity) return [];
    const raw = [
      entity,
      entity.id,
      entity._id,
      entity.userId,
      entity.user?.id,
      entity.user?._id,
      entity.user?.userId,
    ].filter((v) => v !== undefined && v !== null && v !== '');

    return Array.from(new Set(raw.map((v) => String(v))));
  };

  // Handle different response structures and enforce current-user filtering.
  const transactions = useMemo(() => {
    const rawTransactions = Array.isArray(paymentsData) ? paymentsData : (paymentsData?.data || []);
    if (!currentUserId) return [];

    return rawTransactions.filter((payment: any) => {
      const vendorIds = new Set<string>([
        ...getCandidateIds(payment?.vendor),
        ...getCandidateIds(payment?.vendorId),
        ...getCandidateIds(payment?.order?.vendor),
        ...getCandidateIds(payment?.order?.vendorId),
      ]);

      const buyerIds = new Set<string>([
        ...getCandidateIds(payment?.buyer),
        ...getCandidateIds(payment?.buyerId),
        ...getCandidateIds(payment?.user),
        ...getCandidateIds(payment?.userId),
        ...getCandidateIds(payment?.customer),
        ...getCandidateIds(payment?.customerId),
        ...getCandidateIds(payment?.order?.buyer),
        ...getCandidateIds(payment?.order?.buyerId),
        ...getCandidateIds(payment?.order?.user),
        ...getCandidateIds(payment?.order?.userId),
      ]);

      if (userType === 'vendor') return vendorIds.has(String(currentUserId));
      if (userType === 'buyer' || userType === 'user') return buyerIds.has(String(currentUserId));
      return vendorIds.has(String(currentUserId)) || buyerIds.has(String(currentUserId));
    });
  }, [paymentsData, currentUserId, userType]);
  const isStripeConnected = Boolean(stripeStatus?.chargesEnabled && stripeStatus?.payoutsEnabled);
  const isConnectingStripe = isCreatingStripeAccount || isCreatingStripeLink;

  const handleConnectStripe = async () => {
    try {
      if (!stripeStatus?.stripeAccountId) {
        await createVendorAccount(undefined).unwrap();
      }

      const linkData = await createAccountLink(undefined).unwrap();
      const onboardingUrl = linkData?.url;
      if (!onboardingUrl) {
        Alert.alert("Error", "Stripe onboarding link was not returned.");
        return;
      }

      router.push({
        pathname: '/(screens)/stripe_webview',
        params: {
          url: encodeURIComponent(onboardingUrl),
          flow: 'connect',
          title: 'Stripe Connect',
        },
      });

    } catch (error: any) {
      Alert.alert("Error", error?.data?.message || "Failed to connect Stripe.");
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.historyCard}>
      <View style={styles.iconContainer}>
        <ArrowDownLeft color="#1E7B73" size={20} />
      </View>
      <View style={styles.historyInfo}>
        <Text style={styles.historyTitle}>
          {item.order?.orderNumber ? `Order ${item.order.orderNumber}` : 'Payment'}
        </Text>
        <Text style={styles.historyTime}>
          {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Date N/A'}
        </Text>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
      <Text style={[styles.amountText, { color: item.status === 'succeeded' ? '#1E7B73' : '#F59E0B' }]}>
        ${Number(item.amount).toFixed(2)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color="#333" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.contentContainer}>
        {/* Payment Method Section */}
        <View>
          <Text style={styles.sectionTitle}>Payment method</Text>
          <TouchableOpacity
            style={styles.paymentCard}
            onPress={handleConnectStripe}
            disabled={isConnectingStripe || isStripeStatusLoading}
          >
            <View style={styles.paymentLeft}>
              {isStripeConnected ? (
                <Plus color="#1E7B73" size={20} />
              ) : (
                <Plus color="#333" size={20} />
              )}
              <Text style={styles.paymentText}>
                {isStripeConnected ? "Stripe connected" : "Add Stripe"}
              </Text>
            </View>
            {isConnectingStripe || isStripeStatusLoading ? (
              <ActivityIndicator size="small" color="#1E7B73" />
            ) : (
              <ChevronRight color="#CCC" size={20} />
            )}
          </TouchableOpacity>
        </View>

        {/* History Section */}
        <Text style={styles.sectionTitle}>History</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#1E7B73" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id || item._id || Math.random().toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No transaction history found.</Text>
            }
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} colors={['#1E7B73']} />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FBF9', // Light greenish background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  paymentCard: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    // Shadow for iOS/Android
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  paymentText: {
    fontSize: 15,
    color: '#333',
  },
  historyCard: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 1,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#F0F9F8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E7B73',
  },
  historyInfo: {
    flex: 1,
    marginLeft: 15,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  historyTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  statusText: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
    textTransform: 'capitalize'
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 14
  }
});
