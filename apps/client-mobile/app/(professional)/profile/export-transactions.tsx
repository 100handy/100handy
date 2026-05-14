import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, FileText, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Modal, ModalBackdrop, ModalContent, ModalBody } from '@/components/ui/modal';
import { goBackOrReplace } from '@/lib/navigation';

const FILE_TYPES = ['CSV', 'PDF', 'Excel'] as const;
type FileType = typeof FILE_TYPES[number];

// Generate years from current year going back 10 years
const generateYears = (): string[] => {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let i = 0; i < 10; i++) {
    years.push((currentYear - i).toString());
  }
  return years;
};

const YEARS = generateYears();

export default function ExportTransactionsScreen() {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<FileType | null>(null);
  const [showYearSheet, setShowYearSheet] = useState(false);
  const [showFileTypeSheet, setShowFileTypeSheet] = useState(false);

  const handleSendEmail = () => {
    if (!selectedYear || !selectedFileType) return;
    Alert.alert(
      'Coming Soon',
      'Transaction export will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    setShowYearSheet(false);
  };

  const handleFileTypeSelect = (fileType: FileType) => {
    setSelectedFileType(fileType);
    setShowFileTypeSheet(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-1">
        {/* Header */}
        <View className="bg-white px-5 py-4 border-b border-gray-100">
          <View className="flex-row items-center">
            <Pressable onPress={() => goBackOrReplace(router, '/(professional)/(tabs)/profile')} className="mr-3">
              <ArrowLeft size={24} color="#30352d" />
            </Pressable>
            <Text className="text-[#30352d] text-[18px] font-bold">
              Export Transactions
            </Text>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-5 pt-6">
            {/* Instruction Text */}
            <Text className="text-[#30352d] text-[16px] font-medium mb-6">
              Choose a time range and a file type:
            </Text>

            {/* Year Selector Section */}
            <View className="flex-col">
              {/* Divider above */}
              <View className="h-px bg-gray-200" />
              
              <Pressable
                onPress={() => setShowYearSheet(true)}
                className="py-4"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-[#333a31] text-[12px] font-medium mr-4">
                    Year
                  </Text>
                  <Text
                    className={`text-[18px] font-medium flex-1 text-right mr-3 ${
                      selectedYear ? 'text-[#30352d]' : 'text-[#333a31]'
                    }`}
                  >
                    {selectedYear || 'Choose a year…'}
                  </Text>
                  <Calendar size={20} color="#30352d" />
                </View>
              </Pressable>
              
              {/* Divider below */}
              <View className="h-px bg-gray-200" />
              
              {/* Selected Year Display (centered below) - shows when year is selected */}
              {selectedYear && (
                <Text className="text-[#333a31] text-center mt-2 text-[18px]">
                  {selectedYear}
                </Text>
              )}
            </View>

            {/* File Type Selector Section */}
            <View className="flex-col">
              {/* Divider above */}
              <View className="h-px bg-gray-200" />
              
              <Pressable
                onPress={() => setShowFileTypeSheet(true)}
                className="py-4"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-[#333a31] text-[12px] font-medium mr-4">
                    File type
                  </Text>
                  <Text
                    className={`text-[18px] font-medium flex-1 text-right mr-3 ${
                      selectedFileType ? 'text-[#30352d]' : 'text-[#333a31]'
                    }`}
                  >
                    {selectedFileType || 'Choose a file type…'}
                  </Text>
                  <FileText size={20} color="#30352d" />
                </View>
              </Pressable>
              
              {/* Divider below */}
              <View className="h-px bg-gray-200" />
            </View>
          </View>
        </ScrollView>

        {/* Bottom Button */}
        <View className="px-5 pb-8 pt-4 border-t border-gray-100">
          <Pressable
            onPress={handleSendEmail}
            className="bg-clay-orange rounded-full py-4"
            disabled={!selectedYear || !selectedFileType}
            style={{
              opacity: !selectedYear || !selectedFileType ? 0.5 : 1,
            }}
          >
            <Text className="text-white text-[18px] font-bold text-center">
              Send to my Email
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Year Selector Modal */}
      <Modal isOpen={showYearSheet} onClose={() => setShowYearSheet(false)} size="full">
        <ModalBackdrop />
        <ModalContent className="bg-white">
          <ModalBody>
            {/* Drag Indicator */}
            <View className="w-full items-center pt-2 pb-1">
              <View className="w-12 h-1 rounded-full bg-gray-300" />
            </View>

            <View className="w-full pb-4 pt-2">
              <Text className="text-center text-base font-semibold text-[#30352d]">
                Select Year
              </Text>
            </View>

            <ScrollView className="w-full">
              <View className="flex-col w-full">
                {YEARS.map((year) => {
                  const isSelected = selectedYear === year;
                  return (
                    <Pressable
                      key={year}
                      onPress={() => handleYearSelect(year)}
                      className="border-b border-gray-100"
                      style={{ paddingVertical: 16, paddingHorizontal: 20 }}
                    >
                      <View className="flex-row flex-1 items-center justify-between">
                        <Text
                          className="text-base"
                          style={{
                            color: isSelected ? '#30352d' : '#333a31',
                            fontWeight: isSelected ? '600' : '400',
                          }}
                        >
                          {year}
                        </Text>
                        {isSelected && (
                          <Check size={20} color="#30352d" strokeWidth={2.5} />
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* File Type Selector Modal */}
      <Modal isOpen={showFileTypeSheet} onClose={() => setShowFileTypeSheet(false)}>
        <ModalBackdrop />
        <ModalContent className="bg-white">
          <ModalBody>
            {/* Drag Indicator */}
            <View className="w-full items-center pt-2 pb-1">
              <View className="w-12 h-1 rounded-full bg-gray-300" />
            </View>

            <View className="w-full pb-4 pt-2">
              <Text className="text-center text-base font-semibold text-[#30352d]">
                Select File Type
              </Text>
            </View>

            <View className="flex-col w-full">
              {FILE_TYPES.map((fileType) => {
                const isSelected = selectedFileType === fileType;
                return (
                  <Pressable
                    key={fileType}
                    onPress={() => handleFileTypeSelect(fileType)}
                    className="border-b border-gray-100"
                    style={{ paddingVertical: 16, paddingHorizontal: 20 }}
                  >
                    <View className="flex-row flex-1 items-center justify-between">
                      <Text
                        className="text-base"
                        style={{
                          color: isSelected ? '#30352d' : '#333a31',
                          fontWeight: isSelected ? '600' : '400',
                        }}
                      >
                        {fileType}
                      </Text>
                      {isSelected && (
                        <Check size={20} color="#30352d" strokeWidth={2.5} />
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ModalBody>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
}
