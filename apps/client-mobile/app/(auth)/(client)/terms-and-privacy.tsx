import React, { useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Checkbox, CheckboxIndicator, CheckboxIcon, CheckboxLabel } from '@/components/ui/checkbox';
import { Button, ButtonText } from '@/components/ui/button';
import { Image } from 'expo-image';
import { CheckIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';

export default function TermsAndPrivacyScreen() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const router = useRouter();

  const handleContinue = () => {
    router.push('/(auth)/(client)/sign-up');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="dark-content" />
      <Header
        title="Term & Privacy"
        showBellIcon={false}
        showFilterIcon={false}
        onBackPress={() => router.back()}
      />
      <Box className="flex-1 justify-center items-center px-6">
        <Box className="items-center -mt-12">
          <HStack className="items-baseline">
            <Text className="text-4xl font-worksans-light text-theme-font">
              100
            </Text>
            <Text className="text-2xl font-worksans-bold text-theme-font tracking-wider">
              HANDY
            </Text>
          </HStack>
        </Box>

        <Image
          source={{ uri: "https://s3-alpha-sig.figma.com/img/66ac/27bf/d6280f34ee2ab556b968fe7bd96b1609?Expires=1760313600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Dz-gCpYrwXiEcA1hUDLBuzitmAawPJxCCjvArfIGWgJ9liQnl4OkGAuqmECipZ4OEoa5SaKD9n1aRjWk6MLLTkeFDX2Gzpb0XpUQPSc0~Tp-Pw7RUiXjOkKqJRnOChidbc857sOWnpWIHoFjHIc56VqOrI-NIefk24Z0MhRKBRZvmwa3~zcnxAgbY6UCLT0fN0PJCO8ANtabuJmasi-ce5zYkmi5s8dkGKdjAxLyzSB1EQ8qtKOFn6A5SiCyg9jd5lIDxQCoeUSwgjqwU6kpkd8zIebrtApKKdQBa-ok98Nmc3vRU3DUXxKpasYGcRCS5ziItW9-WwUkdljm-3TF8Q__" }}
          alt="Terms and Privacy Image"
          style={{ width: 180, height: 180, marginVertical: 40 }}
          resizeMode="contain"
        />

        <Box className="w-full mb-5">
          <Checkbox
            value="terms"
            isChecked={termsAccepted}
            onChange={setTermsAccepted}
            size="md"
            aria-label="Accept terms and conditions"
            className="mb-5"
          >
            <CheckboxIndicator className="mr-3 data-[checked=true]:bg-clay-orange data-[checked=true]:border-clay-orange">
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
            <CheckboxLabel>
              <Text className="text-sm text-typography-700">I agree to the Terms of Service and have reviewed the Privacy Policy.</Text>
            </CheckboxLabel>
          </Checkbox>

          <Checkbox
            value="marketing"
            isChecked={marketingAccepted}
            onChange={setMarketingAccepted}
            size="md"
            aria-label="Accept marketing communications"
          >
            <CheckboxIndicator className="mr-3 data-[checked=true]:bg-clay-orange data-[checked=true]:border-clay-orange">
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
            <CheckboxLabel>
              <Text className="text-sm text-typography-700">I do not wish to receive promotional communications from 100 Handy.</Text>
            </CheckboxLabel>
          </Checkbox>
        </Box>

        <Box className="absolute bottom-10 w-full">
            <Button
                size="xl"
                className={`h-[60px] rounded-full shadow-lg ${termsAccepted ? 'bg-clay-orange' : 'bg-gray-200'}`}
                onPress={handleContinue}
                disabled={!termsAccepted}
            >
                <ButtonText className={`text-lg font-worksans-bold ${termsAccepted ? 'text-white' : 'text-gray-400'}`}>
                Continue
                </ButtonText>
            </Button>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
