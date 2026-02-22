import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, Alert, View, Text, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, HelpCircle, Banknote, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react-native';
import {
  getConnectAccountStatus,
  getOrCreateStripeConnectAccount,
  createConnectAccountLink,
  ConnectAccountStatus,
} from '@shared/supabase/payment-methods';
import { useAuthStore } from '@shared/supabase';

type AccountState = 'loading' | 'not_started' | 'pending' | 'active' | 'error';

export default function DirectDepositScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [accountState, setAccountState] = useState<AccountState>('loading');
  const [accountStatus, setAccountStatus] = useState<ConnectAccountStatus | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setAccountState('loading');
        setErrorMessage(null);
        const status = await getConnectAccountStatus();

        if (cancelled) return;

        if (!status) {
          setErrorMessage('Unable to load account information');
          setAccountState('error');
          return;
        }

        setAccountStatus(status);

        if (!status.hasAccount) {
          setAccountState('not_started');
        } else if (status.payoutsEnabled) {
          setAccountState('active');
        } else {
          setAccountState('pending');
        }
      } catch (error: any) {
        if (cancelled) return;
        console.error('Error loading account status:', error);
        setErrorMessage(error?.message || 'Unable to load account information');
        setAccountState('error');
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  const loadAccountStatus = async () => {
    try {
      setAccountState('loading');
      setErrorMessage(null);
      const status = await getConnectAccountStatus();

      if (!status) {
        setErrorMessage('Unable to load account information');
        setAccountState('error');
        return;
      }

      setAccountStatus(status);

      if (!status.hasAccount) {
        setAccountState('not_started');
      } else if (status.payoutsEnabled) {
        setAccountState('active');
      } else {
        setAccountState('pending');
      }
    } catch (error: any) {
      console.error('Error loading account status:', error);
      setErrorMessage(error?.message || 'Unable to load account information');
      setAccountState('error');
    }
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadAccountStatus();
    setIsRefreshing(false);
  }, []);

  const handleSetupAccount = async () => {
    try {
      setIsSettingUp(true);

      // Use HTTPS URLs - user will return to app manually after completing setup
      const refreshUrl = 'https://100handy.com/connect/refresh';
      const returnUrl = 'https://100handy.com/connect/return';

      const result = await getOrCreateStripeConnectAccount(undefined, refreshUrl, returnUrl);

      if (!result) {
        Alert.alert('Error', 'Failed to create account. Please try again.');
        return;
      }

      // Open Stripe onboarding in in-app browser
      await WebBrowser.openBrowserAsync(result.accountLinkUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      });

      // Refresh status when browser is closed
      await loadAccountStatus();
    } catch (error: any) {
      console.error('Error setting up account:', error);
      const errorMessage = error?.message || 'Failed to start setup. Please try again.';
      Alert.alert('Setup Error', errorMessage);
    } finally {
      setIsSettingUp(false);
    }
  };

  const handleCompleteSetup = async () => {
    try {
      setIsSettingUp(true);

      const refreshUrl = 'https://100handy.com/connect/refresh';
      const returnUrl = 'https://100handy.com/connect/return';

      const result = await createConnectAccountLink('onboarding', refreshUrl, returnUrl);

      if (!result) {
        Alert.alert('Error', 'Failed to create setup link. Please try again.');
        return;
      }

      // Open Stripe onboarding in in-app browser
      await WebBrowser.openBrowserAsync(result.url, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      });

      // Refresh status when browser is closed
      await loadAccountStatus();
    } catch (error) {
      console.error('Error completing setup:', error);
      Alert.alert('Error', 'Failed to continue setup. Please try again.');
    } finally {
      setIsSettingUp(false);
    }
  };

  const handleUpdateAccount = async () => {
    try {
      setIsSettingUp(true);

      const refreshUrl = 'https://100handy.com/connect/refresh';
      const returnUrl = 'https://100handy.com/connect/return';

      const result = await createConnectAccountLink('update', refreshUrl, returnUrl);

      if (!result) {
        Alert.alert('Error', 'Failed to create update link. Please try again.');
        return;
      }

      // Open Stripe update in in-app browser
      await WebBrowser.openBrowserAsync(result.url, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      });

      // Refresh status when browser is closed
      await loadAccountStatus();
    } catch (error) {
      console.error('Error updating account:', error);
      Alert.alert('Error', 'Failed to open update page. Please try again.');
    } finally {
      setIsSettingUp(false);
    }
  };

  const handleHelp = () => {
    Alert.alert(
      'Direct Deposit Help',
      'Direct deposit allows you to receive your earnings directly into your bank account.\n\nWe use Stripe Connect for secure and fast transfers. When you set up direct deposit, you\'ll be redirected to Stripe to securely enter your bank details and verify your identity.\n\nYour information is encrypted and handled securely by Stripe.',
      [{ text: 'Got it' }]
    );
  };

  const renderContent = () => {
    switch (accountState) {
      case 'loading':
        return (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#B29D88" />
            <Text className="font-worksans text-gray-600 mt-4">Loading...</Text>
          </View>
        );

      case 'not_started':
        return (
          <ScrollView
            className="flex-1 bg-white"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="#B29D88"
              />
            }
          >
            {/* Info Card */}
            <View className="mx-5 mt-6 mb-6 bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <View className="flex-col items-center space-y-4">
                <Text className="font-worksans-bold text-xl text-theme-font text-center">
                  Set Up Direct Deposit
                </Text>
                <Text className="font-worksans text-sm text-gray-600 text-center leading-5">
                  Get paid directly to your bank account. We partner with Stripe for secure, fast transfers worldwide.
                </Text>
                <View className="w-[100px] h-[100px] rounded-full bg-sage-green items-center justify-center">
                  <Banknote color="#30352D" size={50} strokeWidth={1.5} />
                </View>
              </View>
            </View>

            {/* Features List */}
            <View className="mx-5 mb-6">
              <View className="flex-row items-center mb-3">
                <CheckCircle color="#7EC04B" size={20} />
                <Text className="font-worksans text-sm text-gray-700 ml-3">Fast payouts to your bank</Text>
              </View>
              <View className="flex-row items-center mb-3">
                <CheckCircle color="#7EC04B" size={20} />
                <Text className="font-worksans text-sm text-gray-700 ml-3">Secure identity verification</Text>
              </View>
              <View className="flex-row items-center mb-3">
                <CheckCircle color="#7EC04B" size={20} />
                <Text className="font-worksans text-sm text-gray-700 ml-3">Supports banks worldwide</Text>
              </View>
              <View className="flex-row items-center">
                <CheckCircle color="#7EC04B" size={20} />
                <Text className="font-worksans text-sm text-gray-700 ml-3">Protected by Stripe</Text>
              </View>
            </View>

            {/* Powered by Stripe Badge */}
            <View className="mx-5 mt-2">
              <View className="border-2 border-blue-600 rounded-lg px-4 py-2 self-start">
                <View className="flex-row items-center space-x-2">
                  <Text className="font-worksans text-sm text-theme-font">Powered by</Text>
                  <Text className="font-worksans-bold text-base text-blue-600">stripe</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        );

      case 'pending':
        return (
          <ScrollView
            className="flex-1 bg-white"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="#B29D88"
              />
            }
          >
            {/* Status Card */}
            <View className="mx-5 mt-6 mb-6 bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
              <View className="flex-col items-center space-y-4">
                <View className="w-[80px] h-[80px] rounded-full bg-yellow-100 items-center justify-center">
                  <AlertCircle color="#D97706" size={40} strokeWidth={1.5} />
                </View>
                <Text className="font-worksans-bold text-xl text-theme-font text-center">
                  Setup Incomplete
                </Text>
                <Text className="font-worksans text-sm text-gray-600 text-center leading-5">
                  Please complete your account setup to start receiving payouts. This includes verifying your identity and adding your bank details.
                </Text>
              </View>
            </View>

            {/* Requirements Info */}
            {accountStatus?.requirements?.currentlyDue && accountStatus.requirements.currentlyDue.length > 0 && (
              <View className="mx-5 mb-6">
                <Text className="font-worksans-semibold text-sm text-gray-700 mb-2">
                  Items to complete:
                </Text>
                {accountStatus.requirements.currentlyDue.slice(0, 5).map((item, index) => (
                  <View key={index} className="flex-row items-center mb-2">
                    <View className="w-2 h-2 rounded-full bg-yellow-500 mr-3" />
                    <Text className="font-worksans text-sm text-gray-600">
                      {item.replace(/_/g, ' ').replace(/\./g, ' → ')}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Powered by Stripe Badge */}
            <View className="mx-5">
              <View className="border-2 border-blue-600 rounded-lg px-4 py-2 self-start">
                <View className="flex-row items-center space-x-2">
                  <Text className="font-worksans text-sm text-theme-font">Powered by</Text>
                  <Text className="font-worksans-bold text-base text-blue-600">stripe</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        );

      case 'active':
        return (
          <ScrollView
            className="flex-1 bg-white"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="#B29D88"
              />
            }
          >
            {/* Success Card */}
            <View className="mx-5 mt-6 mb-6 bg-green-50 rounded-2xl p-6 border border-green-200">
              <View className="flex-col items-center space-y-4">
                <View className="w-[80px] h-[80px] rounded-full bg-green-100 items-center justify-center">
                  <CheckCircle color="#16A34A" size={40} strokeWidth={1.5} />
                </View>
                <Text className="font-worksans-bold text-xl text-theme-font text-center">
                  Direct Deposit Active
                </Text>
                <Text className="font-worksans text-sm text-gray-600 text-center leading-5">
                  Your account is set up and ready to receive payouts.
                </Text>
              </View>
            </View>

            {/* Bank Account Info */}
            {accountStatus?.externalAccounts && accountStatus.externalAccounts.length > 0 && (
              <View className="mx-5 mb-6">
                <Text className="font-worksans-semibold text-base text-theme-font mb-3">
                  Bank Account
                </Text>
                {accountStatus.externalAccounts.map((account, index) => (
                  <View key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className="font-worksans-semibold text-sm text-theme-font">
                          {account.bankName || 'Bank Account'}
                        </Text>
                        <Text className="font-worksans text-sm text-gray-500">
                          ••••{account.last4} • {account.currency?.toUpperCase()}
                        </Text>
                      </View>
                      {account.default && (
                        <View className="bg-green-100 px-2 py-1 rounded">
                          <Text className="font-worksans text-xs text-green-700">Default</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Account Status */}
            <View className="mx-5 mb-6">
              <Text className="font-worksans-semibold text-base text-theme-font mb-3">
                Account Status
              </Text>
              <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="font-worksans text-sm text-gray-600">Payouts</Text>
                  <Text className="font-worksans-semibold text-sm text-green-600">Enabled</Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="font-worksans text-sm text-gray-600">Country</Text>
                  <Text className="font-worksans-semibold text-sm text-theme-font">
                    {accountStatus?.country?.toUpperCase() || 'N/A'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Update Account Button */}
            <View className="mx-5">
              <Pressable
                className="flex-row items-center justify-center py-3 border border-gray-300 rounded-full"
                onPress={handleUpdateAccount}
                disabled={isSettingUp}
              >
                {isSettingUp ? (
                  <ActivityIndicator size="small" color="#30352D" />
                ) : (
                  <>
                    <ExternalLink color="#30352D" size={18} />
                    <Text className="font-worksans-semibold text-theme-font text-base ml-2">
                      Update Bank Details
                    </Text>
                  </>
                )}
              </Pressable>
            </View>

            {/* Powered by Stripe Badge */}
            <View className="mx-5 mt-6">
              <View className="border-2 border-blue-600 rounded-lg px-4 py-2 self-start">
                <View className="flex-row items-center space-x-2">
                  <Text className="font-worksans text-sm text-theme-font">Powered by</Text>
                  <Text className="font-worksans-bold text-base text-blue-600">stripe</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        );

      case 'error':
        return (
          <View className="flex-1 items-center justify-center px-6">
            <AlertCircle color="#EF4444" size={48} />
            <Text className="font-worksans-semibold text-lg text-theme-font mt-4 text-center">
              Something went wrong
            </Text>
            <Text className="font-worksans text-sm text-gray-600 mt-2 text-center">
              {errorMessage || 'Unable to load account information. Please try again.'}
            </Text>
            <Pressable
              className="mt-6 px-6 py-3 bg-sage-green rounded-full"
              onPress={loadAccountStatus}
            >
              <Text className="font-worksans-semibold text-white">Retry</Text>
            </Pressable>
          </View>
        );
    }
  };

  const renderBottomButton = () => {
    if (accountState === 'not_started') {
      return (
        <View className="px-5 pb-6 pt-4 bg-white border-t border-gray-100">
          <Pressable
            className={`rounded-full py-4 items-center flex-row justify-center ${
              isSettingUp ? 'bg-gray-400' : 'bg-sage-green'
            }`}
            onPress={handleSetupAccount}
            disabled={isSettingUp}
          >
            {isSettingUp ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator size="small" color="white" />
                <Text className="font-worksans-semibold text-white text-lg">Setting up...</Text>
              </View>
            ) : (
              <>
                <ExternalLink color="white" size={20} />
                <Text className="font-worksans-semibold text-white text-lg ml-2">
                  Set Up Direct Deposit
                </Text>
              </>
            )}
          </Pressable>
        </View>
      );
    }

    if (accountState === 'pending') {
      return (
        <View className="px-5 pb-6 pt-4 bg-white border-t border-gray-100">
          <Pressable
            className={`rounded-full py-4 items-center flex-row justify-center ${
              isSettingUp ? 'bg-gray-400' : 'bg-clay-orange'
            }`}
            onPress={handleCompleteSetup}
            disabled={isSettingUp}
          >
            {isSettingUp ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator size="small" color="white" />
                <Text className="font-worksans-semibold text-white text-lg">Loading...</Text>
              </View>
            ) : (
              <>
                <ExternalLink color="white" size={20} />
                <Text className="font-worksans-semibold text-white text-lg ml-2">
                  Complete Setup
                </Text>
              </>
            )}
          </Pressable>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row py-4 px-5 items-center justify-between border-b border-gray-100">
        <Pressable className="w-10 items-start" onPress={() => router.back()}>
          <ChevronLeft color="#30352D" size={28} strokeWidth={2} />
        </Pressable>
        <Text className="font-worksans-bold text-xl text-theme-font">
          Direct Deposit
        </Text>
        <Pressable className="w-10 items-end" onPress={handleHelp}>
          <HelpCircle color="#30352D" size={28} strokeWidth={2} />
        </Pressable>
      </View>

      {renderContent()}
      {renderBottomButton()}
    </SafeAreaView>
  );
}
