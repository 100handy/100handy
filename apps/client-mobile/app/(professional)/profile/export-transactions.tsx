import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetScrollView,
} from '@/components/ui/actionsheet';
import { ArrowLeft, Calendar, FileText, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';

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
    // TODO: Implement email export functionality
    console.log('Exporting transactions:', { selectedYear, selectedFileType });
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
      <Box className="flex-1">
        {/* Header */}
        <Box className="bg-white px-5 py-4 border-b border-gray-100">
          <HStack className="items-center">
            <Pressable onPress={() => router.back()} className="mr-3">
              <ArrowLeft size={24} color="#30352d" />
            </Pressable>
            <Text className="text-[#30352d] text-[18px] font-bold">
              Export Transactions
            </Text>
          </HStack>
        </Box>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <Box className="px-5 pt-6">
            {/* Instruction Text */}
            <Text className="text-[#30352d] text-[16px] font-medium mb-6">
              Choose a time range and a file type:
            </Text>

            {/* Year Selector Section */}
            <VStack>
              {/* Divider above */}
              <Box className="h-px bg-gray-200" />
              
              <Pressable
                onPress={() => setShowYearSheet(true)}
                className="py-4"
              >
                <HStack className="items-center justify-between">
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
                </HStack>
              </Pressable>
              
              {/* Divider below */}
              <Box className="h-px bg-gray-200" />
              
              {/* Selected Year Display (centered below) - shows when year is selected */}
              {selectedYear && (
                <Text className="text-[#333a31] text-center mt-2 text-[18px]">
                  {selectedYear}
                </Text>
              )}
            </VStack>

            {/* File Type Selector Section */}
            <VStack>
              {/* Divider above */}
              <Box className="h-px bg-gray-200" />
              
              <Pressable
                onPress={() => setShowFileTypeSheet(true)}
                className="py-4"
              >
                <HStack className="items-center justify-between">
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
                </HStack>
              </Pressable>
              
              {/* Divider below */}
              <Box className="h-px bg-gray-200" />
            </VStack>
          </Box>
        </ScrollView>

        {/* Bottom Button */}
        <Box className="px-5 pb-8 pt-4 border-t border-gray-100">
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
        </Box>
      </Box>

      {/* Year Selector ActionSheet */}
      <Actionsheet isOpen={showYearSheet} onClose={() => setShowYearSheet(false)}>
        <ActionsheetBackdrop />
        <ActionsheetContent className="bg-white">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator className="bg-gray-300" />
          </ActionsheetDragIndicatorWrapper>
          
          <Box className="w-full pb-4 pt-2">
            <Text className="text-center text-base font-semibold text-[#30352d]">
              Select Year
            </Text>
          </Box>

          <ActionsheetScrollView className="w-full">
            <VStack className="w-full">
              {YEARS.map((year) => {
                const isSelected = selectedYear === year;
                return (
                  <ActionsheetItem
                    key={year}
                    onPress={() => handleYearSelect(year)}
                    className="border-b border-gray-100"
                    style={{ paddingVertical: 16, paddingHorizontal: 20 }}
                  >
                    <HStack className="flex-1 items-center justify-between">
                      <ActionsheetItemText
                        className="text-base"
                        style={{
                          color: isSelected ? '#30352d' : '#333a31',
                          fontWeight: isSelected ? '600' : '400',
                        }}
                      >
                        {year}
                      </ActionsheetItemText>
                      {isSelected && (
                        <Check size={20} color="#30352d" strokeWidth={2.5} />
                      )}
                    </HStack>
                  </ActionsheetItem>
                );
              })}
            </VStack>
          </ActionsheetScrollView>
        </ActionsheetContent>
      </Actionsheet>

      {/* File Type Selector ActionSheet */}
      <Actionsheet isOpen={showFileTypeSheet} onClose={() => setShowFileTypeSheet(false)}>
        <ActionsheetBackdrop />
        <ActionsheetContent className="bg-white">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator className="bg-gray-300" />
          </ActionsheetDragIndicatorWrapper>
          
          <Box className="w-full pb-4 pt-2">
            <Text className="text-center text-base font-semibold text-[#30352d]">
              Select File Type
            </Text>
          </Box>

          <VStack className="w-full">
            {FILE_TYPES.map((fileType) => {
              const isSelected = selectedFileType === fileType;
              return (
                <ActionsheetItem
                  key={fileType}
                  onPress={() => handleFileTypeSelect(fileType)}
                  className="border-b border-gray-100"
                  style={{ paddingVertical: 16, paddingHorizontal: 20 }}
                >
                  <HStack className="flex-1 items-center justify-between">
                    <ActionsheetItemText
                      className="text-base"
                      style={{
                        color: isSelected ? '#30352d' : '#333a31',
                        fontWeight: isSelected ? '600' : '400',
                      }}
                    >
                      {fileType}
                    </ActionsheetItemText>
                    {isSelected && (
                      <Check size={20} color="#30352d" strokeWidth={2.5} />
                    )}
                  </HStack>
                </ActionsheetItem>
              );
            })}
          </VStack>
        </ActionsheetContent>
      </Actionsheet>
    </SafeAreaView>
  );
}
