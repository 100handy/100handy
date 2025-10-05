import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { ChevronLeft, CreditCard, Shield } from 'lucide-react-native';

interface FormData {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  postcode: string;
}

const CreditCardLogo = ({ cardType }: { cardType: string }) => {
  // Placeholder for card logos - in a real app, you'd have actual logo images
  const logoColors: { [key: string]: string } = {
    visa: '#1A1F71',
    mastercard: '#EB001B',
    amex: '#006FCF',
    discover: '#FF6000',
    jcb: '#0E4C96',
  };

  return (
    <View 
      className="border border-gray-200 justify-center items-center"
      style={{
        width: 40,
        height: 28,
        borderRadius: 4,
        backgroundColor: logoColors[cardType] || '#e5e5e5',
      }}
    >
      <Text className="text-white text-xs font-bold">
        {cardType.toUpperCase().substring(0, 4)}
      </Text>
    </View>
  );
};

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'number-pad';
  maxLength?: number;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: any;
  showIcon?: boolean;
}

const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  maxLength,
  secureTextEntry = false,
  autoCapitalize = 'none',
  style,
  showIcon = false,
}: InputFieldProps) => (
  <View style={[{ marginBottom: 20 }, style]}>
    <Text
      className="text-gray-400 mb-2"
      style={{
        fontFamily: 'Work Sans',
        fontSize: 14,
        fontWeight: '400' as const,
      }}
    >
      {label}
    </Text>
    <View className="flex-row items-center border-b border-gray-200">
      {showIcon && (
        <Icon 
          as={CreditCard} 
          size="sm" 
          className="text-gray-400 mr-2" 
          style={{ width: 20, height: 20 }}
        />
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        placeholderTextColor="#d0d0d0"
        style={{
          flex: 1,
          height: 48,
          paddingHorizontal: 0,
          fontFamily: 'Work Sans',
          fontSize: 16,
          fontWeight: '400' as const,
          color: '#333A31', // Using theme-font color
        }}
      />
    </View>
  </View>
);

export default function CreditCardScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    postcode: '',
  });

  const formatCardNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  const formatExpiryDate = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add slash after 2 digits
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    setFormData({ ...formData, cardNumber: formatted });
  };

  const handleExpiryDateChange = (text: string) => {
    const formatted = formatExpiryDate(text);
    setFormData({ ...formData, expiryDate: formatted });
  };

  const handleSave = () => {
    // Basic validation
    if (!formData.cardholderName || !formData.cardNumber || !formData.expiryDate || !formData.cvv) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    // Here you would typically save the card details securely
    console.log('Saving card details:', formData);
    Alert.alert('Success', 'Card details saved successfully', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const supportedCards = ['visa', 'mastercard', 'amex', 'discover', 'jcb'];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Box className="flex-1">
        {/* Header */}
        <HStack 
          className="items-center justify-center px-4 bg-white border-b border-gray-100"
          style={{ height: 74, paddingHorizontal: 16 }}
        >
          <Pressable 
            onPress={() => router.back()} 
            className="flex-row items-center absolute left-6"
            style={{ left: 23 }}
          >
            <Icon 
              as={ChevronLeft} 
              size="sm" 
              className="text-theme-font" 
              style={{ width: 20, height: 20 }}
            />
            <Text 
              className="text-theme-font ml-1"
              style={{
                fontFamily: 'Work Sans',
                fontSize: 18,
                fontWeight: '400' as const,
                marginLeft: 4
              }}
            >
              Profile
            </Text>
          </Pressable>
          <Text 
            className="text-theme-font"
            style={{
              fontFamily: 'Work Sans',
              fontSize: 18,
              fontWeight: '700' as const,
              textAlign: 'center' as const
            }}
          >
            Credit Card
          </Text>
        </HStack>

        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Card Logos */}
          <HStack 
            className="items-center px-5 py-4"
            style={{ 
              paddingHorizontal: 20, 
              paddingVertical: 16, 
              gap: 12 
            }}
          >
            {supportedCards.map((cardType) => (
              <CreditCardLogo key={cardType} cardType={cardType} />
            ))}
          </HStack>

          {/* Form Container */}
          <VStack style={{ paddingHorizontal: 20, paddingTop: 24 }}>
            {/* Cardholder Name */}
            <InputField
              label="Cardholder's name"
              placeholder="John Doe"
              value={formData.cardholderName}
              onChangeText={(text) => setFormData({ ...formData, cardholderName: text })}
              autoCapitalize="words"
            />

            {/* Card Number */}
            <InputField
              label="Card number"
              placeholder="Card..."
              value={formData.cardNumber}
              onChangeText={handleCardNumberChange}
              keyboardType="number-pad"
              maxLength={19}
              showIcon={true}
            />

            {/* Expiry Date and CVV Row */}
            <HStack style={{ gap: 16, marginBottom: 20 }}>
              <InputField
                label="Expiry date"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChangeText={handleExpiryDateChange}
                keyboardType="number-pad"
                maxLength={5}
                style={{ flex: 1 }}
              />
              <InputField
                label="CVV/CVC"
                placeholder="CVV/CVC"
                value={formData.cvv}
                onChangeText={(text) => setFormData({ ...formData, cvv: text })}
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry={true}
                style={{ flex: 1 }}
              />
            </HStack>

            {/* Postcode */}
            <InputField
              label="Postcode"
              placeholder="Enter postcode"
              value={formData.postcode}
              onChangeText={(text) => setFormData({ ...formData, postcode: text })}
              autoCapitalize="characters"
            />

            {/* Security Note */}
            <HStack 
              className="items-start p-4 bg-gray-50 rounded-lg mt-4"
              style={{
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderRadius: 8,
                marginTop: 16
              }}
            >
              <Icon 
                as={Shield} 
                size="xs" 
                className="text-gray-500 mr-2 mt-1"
                style={{ 
                  width: 16, 
                  height: 16, 
                  marginRight: 8, 
                  marginTop: 2 
                }}
              />
              <Text
                className="flex-1 text-gray-500"
                style={{
                  fontFamily: 'Work Sans',
                  fontSize: 12,
                  fontWeight: '400' as const,
                  lineHeight: 18,
                  flex: 1
                }}
              >
                Security is important to us. Your information is private and protected.
              </Text>
            </HStack>
          </VStack>
        </ScrollView>

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          className="mx-5 mb-6 items-center justify-center bg-warm-taupe rounded-full"
          style={{
            height: 52,
            borderRadius: 26,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 20,
            marginBottom: 24,
            shadowColor: '#000000',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2
          }}
        >
          <Text
            className="text-white"
            style={{
              fontFamily: 'Work Sans',
              fontSize: 18,
              fontWeight: '700' as const,
            }}
          >
            Save
          </Text>
        </Pressable>
      </Box>
    </SafeAreaView>
  );
}