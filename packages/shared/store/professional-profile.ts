import { create } from 'zustand';
import {
  getChatTemplate,
  saveChatTemplate,
  getHandyProfileExtras,
  updateHandyTools,
  updateHandyVehicles,
  updateHandyQuickFacts,
  updateHandyAboutMe,
  updateHandySyncCalendars,
} from '../supabase/profile';

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
  isSaving: boolean;

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
  clearProfile: () => void;
}

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
  isSaving: false,

  setTools: async (tools: string[]) => {
    const previousTools = get().tools;
    // Optimistic update
    set({ tools, isSaving: true });

    try {
      const success = await updateHandyTools(tools);
      if (!success) {
        // Revert on failure
        set({ tools: previousTools });
        console.error('Failed to save tools to database');
      }
    } catch (error) {
      // Revert on error
      set({ tools: previousTools });
      console.error('Error saving tools:', error);
    } finally {
      set({ isSaving: false });
    }
  },

  setVehicles: async (vehicles: string[]) => {
    const previousVehicles = get().vehicles;
    // Optimistic update
    set({ vehicles, isSaving: true });

    try {
      const success = await updateHandyVehicles(vehicles);
      if (!success) {
        // Revert on failure
        set({ vehicles: previousVehicles });
        console.error('Failed to save vehicles to database');
      }
    } catch (error) {
      // Revert on error
      set({ vehicles: previousVehicles });
      console.error('Error saving vehicles:', error);
    } finally {
      set({ isSaving: false });
    }
  },

  setQuickFacts: async (facts: string[]) => {
    const previousFacts = get().quickFacts;
    // Optimistic update
    set({ quickFacts: facts, isSaving: true });

    try {
      const success = await updateHandyQuickFacts(facts);
      if (!success) {
        // Revert on failure
        set({ quickFacts: previousFacts });
        console.error('Failed to save quick facts to database');
      }
    } catch (error) {
      // Revert on error
      set({ quickFacts: previousFacts });
      console.error('Error saving quick facts:', error);
    } finally {
      set({ isSaving: false });
    }
  },

  setAboutMe: async (text: string) => {
    const previousText = get().aboutMe;
    // Optimistic update
    set({ aboutMe: text, isSaving: true });

    try {
      const success = await updateHandyAboutMe(text);
      if (!success) {
        // Revert on failure
        set({ aboutMe: previousText });
        console.error('Failed to save about me to database');
      }
    } catch (error) {
      // Revert on error
      set({ aboutMe: previousText });
      console.error('Error saving about me:', error);
    } finally {
      set({ isSaving: false });
    }
  },

  setSyncCalendars: async (enabled: boolean) => {
    const previousValue = get().syncCalendars;
    // Optimistic update
    set({ syncCalendars: enabled, isSaving: true });

    try {
      const success = await updateHandySyncCalendars(enabled);
      if (!success) {
        // Revert on failure
        set({ syncCalendars: previousValue });
        console.error('Failed to save sync calendars to database');
      }
    } catch (error) {
      // Revert on error
      set({ syncCalendars: previousValue });
      console.error('Error saving sync calendars:', error);
    } finally {
      set({ isSaving: false });
    }
  },

  setChatTemplate: async (type: 'default' | 'ongoing', message: string) => {
    const previousTemplates = get().chatTemplates;
    // Optimistic update
    set(state => ({
      chatTemplates: {
        ...state.chatTemplates,
        [type]: message,
      },
      isSaving: true,
    }));

    try {
      await saveChatTemplate({ template_type: type, message });
    } catch (error) {
      // Revert on error
      set({ chatTemplates: previousTemplates });
      console.error('Error saving chat template:', error);
    } finally {
      set({ isSaving: false });
    }
  },

  loadProfile: async () => {
    try {
      set({ isLoading: true });

      // Load from Supabase
      const extras = await getHandyProfileExtras();

      if (extras) {
        set({
          tools: extras.tools || [],
          vehicles: extras.vehicles || [],
          quickFacts: extras.quick_facts || [],
          aboutMe: extras.about_me || '',
          syncCalendars: extras.sync_calendars ?? true,
        });
      }

      // Load chat templates from Supabase
      await get().loadChatTemplates();
    } catch (error) {
      console.error('Error loading professional profile:', error);
    } finally {
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

  clearProfile: () => {
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
  },
}));
