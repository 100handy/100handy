import { create } from 'zustand';

export interface TaskFormTasker {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  hourlyRate: number;
  verified: boolean;
}

export interface TaskFormData {
  // Category and service
  categoryId: string | null;
  categoryName: string | null;

  // Location (references useLocationStore)
  locationSet: boolean;

  // Task-specific options (flexible for different service types)
  taskOptions: Record<string, any>;

  // Selected tasker
  selectedTasker: TaskFormTasker | null;

  // Date and time
  selectedDate: Date | null;
  selectedTimeSlot: string | null;

  // Additional details
  additionalNotes: string | null;

  // Pricing estimate
  estimatedPrice: number | null;
  estimatedDuration: number | null; // in hours
}

interface TaskFormState {
  // Form data
  formData: TaskFormData;

  // Current step in multi-step form (0-based index)
  currentStep: number;
  totalSteps: number;

  // Actions
  setCategory: (categoryId: string, categoryName: string) => void;
  setLocationSet: (isSet: boolean) => void;
  setTaskOption: (key: string, value: any) => void;
  setTaskOptions: (options: Record<string, any>) => void;
  setSelectedTasker: (tasker: TaskFormTasker | null) => void;
  setDateTime: (date: Date | null, timeSlot: string | null) => void;
  setAdditionalNotes: (notes: string) => void;
  setEstimate: (price: number | null, duration: number | null) => void;

  // Navigation
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  setTotalSteps: (total: number) => void;

  // Form management
  reset: () => void;
  isFormValid: () => boolean;
}

const initialFormData: TaskFormData = {
  categoryId: null,
  categoryName: null,
  locationSet: false,
  taskOptions: {},
  selectedTasker: null,
  selectedDate: null,
  selectedTimeSlot: null,
  additionalNotes: null,
  estimatedPrice: null,
  estimatedDuration: null,
};

export const useTaskFormStore = create<TaskFormState>((set, get) => ({
  // Initial state
  formData: initialFormData,
  currentStep: 0,
  totalSteps: 6,

  // Actions
  setCategory: (categoryId: string, categoryName: string) => {
    set((state) => ({
      formData: {
        ...state.formData,
        categoryId,
        categoryName,
      },
    }));
  },

  setLocationSet: (isSet: boolean) => {
    set((state) => ({
      formData: {
        ...state.formData,
        locationSet: isSet,
      },
    }));
  },

  setTaskOption: (key: string, value: any) => {
    set((state) => ({
      formData: {
        ...state.formData,
        taskOptions: {
          ...state.formData.taskOptions,
          [key]: value,
        },
      },
    }));
  },

  setTaskOptions: (options: Record<string, any>) => {
    set((state) => ({
      formData: {
        ...state.formData,
        taskOptions: options,
      },
    }));
  },

  setSelectedTasker: (tasker: TaskFormTasker | null) => {
    set((state) => ({
      formData: {
        ...state.formData,
        selectedTasker: tasker,
      },
    }));
  },

  setDateTime: (date: Date | null, timeSlot: string | null) => {
    set((state) => ({
      formData: {
        ...state.formData,
        selectedDate: date,
        selectedTimeSlot: timeSlot,
      },
    }));
  },

  setAdditionalNotes: (notes: string) => {
    set((state) => ({
      formData: {
        ...state.formData,
        additionalNotes: notes,
      },
    }));
  },

  setEstimate: (price: number | null, duration: number | null) => {
    set((state) => ({
      formData: {
        ...state.formData,
        estimatedPrice: price,
        estimatedDuration: duration,
      },
    }));
  },

  // Navigation
  nextStep: () => {
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1),
    }));
  },

  previousStep: () => {
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 0),
    }));
  },

  goToStep: (step: number) => {
    set((state) => ({
      currentStep: Math.max(0, Math.min(step, state.totalSteps - 1)),
    }));
  },

  setTotalSteps: (total: number) => {
    set({ totalSteps: total });
  },

  // Form management
  reset: () => {
    set({
      formData: initialFormData,
      currentStep: 0,
    });
  },

  isFormValid: () => {
    const { formData } = get();

    // Basic validation - can be extended based on requirements
    return (
      formData.categoryId !== null &&
      formData.locationSet &&
      formData.selectedTasker !== null &&
      formData.selectedDate !== null &&
      formData.selectedTimeSlot !== null
    );
  },
}));
