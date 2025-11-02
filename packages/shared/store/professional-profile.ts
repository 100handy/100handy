import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getChatTemplate, saveChatTemplate, ChatTemplate } from '../supabase/profile';

export interface Vehicle {
  name: string;
  description: string;
}

export interface ChatTemplates {
  default: string;
  ongoing: string;
}

export interface ProfessionalProfileState {
  // Profile data
  tools: string[];
  vehicles: string[];
  quickFacts: string[];
  aboutMe: string;
  syncCalendars: boolean;
  chatTemplates: ChatTemplates;

  // Loading state
  isLoading: boolean;

  // Actions
  setTools: (tools: string[]) => Promise<void>;
  setVehicles: (vehicles: string[]) => Promise<void>;
  setQuickFacts: (facts: string[]) => Promise<void>;
  setAboutMe: (text: string) => Promise<void>;
  setSyncCalendars: (enabled: boolean) => Promise<void>;
  setChatTemplate: (type: 'default' | 'ongoing', message: string) => Promise<void>;

  // Persistence
  loadProfile: () => Promise<void>;
  loadChatTemplates: () => Promise<void>;
  clearProfile: () => Promise<void>;
}

const STORAGE_KEY = '@professional_profile';

export const useProfessionalProfileStore = create<ProfessionalProfileState>((set, get) => ({
  // Initial state
  tools: [],
  vehicles: [],
  quickFacts: [],
  aboutMe: '',
  syncCalendars: true,
  chatTemplates: {
    default: '',
    ongoing: '',
  },
  isLoading: false,

  setTools: async (tools: string[]) => {
    set({ tools });
    await saveToStorage({ ...get(), tools });
  },

  setVehicles: async (vehicles: string[]) => {
    set({ vehicles });
    await saveToStorage({ ...get(), vehicles });
  },

  setQuickFacts: async (facts: string[]) => {
    set({ quickFacts: facts });
    await saveToStorage({ ...get(), quickFacts: facts });
  },

  setAboutMe: async (text: string) => {
    set({ aboutMe: text });
    await saveToStorage({ ...get(), aboutMe: text });
  },

  setSyncCalendars: async (enabled: boolean) => {
    set({ syncCalendars: enabled });
    await saveToStorage({ ...get(), syncCalendars: enabled });
  },

  setChatTemplate: async (type: 'default' | 'ongoing', message: string) => {
    try {
      // Save to Supabase
      await saveChatTemplate({ template_type: type, message });

      // Update local state
      set(state => ({
        chatTemplates: {
          ...state.chatTemplates,
          [type]: message,
        },
      }));
    } catch (error) {
      console.error('Error saving chat template:', error);
    }
  },

  loadProfile: async () => {
    try {
      set({ isLoading: true });
      const stored = await AsyncStorage.getItem(STORAGE_KEY);

      if (stored) {
        const data = JSON.parse(stored);
        set({
          tools: data.tools || [],
          vehicles: data.vehicles || [],
          quickFacts: data.quickFacts || [],
          aboutMe: data.aboutMe || '',
          syncCalendars: data.syncCalendars !== undefined ? data.syncCalendars : true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }

      // Load chat templates from Supabase
      await get().loadChatTemplates();
    } catch (error) {
      console.error('Error loading professional profile:', error);
      set({ isLoading: false });
    }
  },

  loadChatTemplates: async () => {
    try {
      const defaultTemplate = await getChatTemplate('default');
      const ongoingTemplate = await getChatTemplate('ongoing');

      set({
        chatTemplates: {
          default: defaultTemplate?.message || '',
          ongoing: ongoingTemplate?.message || '',
        },
      });
    } catch (error) {
      console.error('Error loading chat templates:', error);
    }
  },

  clearProfile: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      set({
        tools: [],
        vehicles: [],
        quickFacts: [],
        aboutMe: '',
        syncCalendars: true,
        chatTemplates: {
          default: '',
          ongoing: '',
        },
      });
    } catch (error) {
      console.error('Error clearing professional profile:', error);
    }
  },
}));

// Helper function to save to storage
async function saveToStorage(state: ProfessionalProfileState) {
  try {
    const dataToSave = {
      tools: state.tools,
      vehicles: state.vehicles,
      quickFacts: state.quickFacts,
      aboutMe: state.aboutMe,
      syncCalendars: state.syncCalendars,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Error saving professional profile:', error);
  }
}
