import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, Share, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gift, X } from 'lucide-react-native';
import { Modal, ModalBackdrop, ModalContent, ModalBody } from '@/components/ui/modal';
import { ensureReferralCode, buildReferralDeepLink } from '@shared/supabase';

type ReferralShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ReferralShareModal({ isOpen, onClose }: ReferralShareModalProps) {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadCode() {
      if (!isOpen) return;
      setIsLoading(true);
      const code = await ensureReferralCode();
      if (isMounted) {
        setReferralCode(code);
        setIsLoading(false);
      }
    }

    loadCode();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const referralLink = useMemo(() => {
    if (!referralCode) return null;
    return buildReferralDeepLink(referralCode);
  }, [referralCode]);

  const handleShare = async () => {
    if (!referralLink) return;

    const message =
      `Help a busy friend! Send them a £10 credit and get £10 when they complete their first task.\n\n` +
      `Sign up here: ${referralLink}`;

    try {
      await Share.share({ message });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalBackdrop />
      <ModalContent size="full" className="w-full h-full bg-[#FBF4ED] p-0 border-0 rounded-none">
        <ModalBody className="p-0 m-0">
          <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
            <View className="flex-1 px-6 py-8">
              {/* Close */}
              <Pressable onPress={onClose} className="absolute top-2 right-2 z-10 p-2">
                <X size={24} color="#333A31" />
              </Pressable>

              <View className="flex-1 items-center justify-center">
                {/* Icon */}
                <View className="w-24 h-24 rounded-full bg-white items-center justify-center mb-6">
                  <Gift size={44} color="#C1856A" />
                </View>

                <Text className="text-2xl font-bold text-center text-[#333A31] mb-3">
                  Help Your Friends, Get £10
                </Text>
                <Text className="text-sm text-center text-[#333A31]/80 leading-5 px-2 mb-8">
                  Help a busy friend! Send them a £10 credit and get £10 when they complete their first task.
                </Text>

                <Text className="text-sm text-center text-[#333A31]/60 mb-3">
                  Copy link or share below:
                </Text>

                <Pressable
                  onPress={handleShare}
                  disabled={!referralLink || isLoading}
                  className="border border-[#0F766E] rounded-full px-10 py-3"
                >
                  <View className="flex-row items-center justify-center gap-2">
                    {isLoading ? <ActivityIndicator size="small" color="#0F766E" /> : null}
                    <Text className="text-[#0F766E] font-bold text-base">
                      Tap to Share
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </SafeAreaView>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}


