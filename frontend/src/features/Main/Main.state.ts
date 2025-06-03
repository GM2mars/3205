const API_URL = import.meta.env.VITE_API_URL;

import { q } from "@/utils";
import { create } from "zustand";


interface MainActions {
  setAlias: (alias: string) => void;
  setExpiresAt: (expiresAt: Date | null) => void;
  setUrl: (originalUrl: string) => void;
  checkAlias: (alias: string) => Promise<{ isUnique: boolean }>;
  cutUrl: () => Promise<void>;
};

interface MainState {
  originalUrl: string;
  shortedUrl: string;
  alias?: string;
  expiresAt?: Date | null;
  error: string;
  loading: boolean;
  actions: MainActions;
};

const useMainStore = create<MainState>((set, get) => ({
  originalUrl: '',
  alias: '',
  expiresAt: null,
  shortedUrl: '',
  error: null,
  loading: false,

  actions: {
    setAlias: (alias: string) => set({ alias }),

    setUrl: (originalUrl: string) => set({ originalUrl }),

    setExpiresAt: (expiresAt: Date | null) => set({ expiresAt }),

    checkAlias: async (alias: string) => {
      return await q.get(`${API_URL}/alias/${alias}`);
    },

    cutUrl: async () => {
      const { originalUrl, alias, expiresAt } = get();

      set({ loading: true, error: null });

      if (alias) {
        const { isUnique } = await get().actions.checkAlias(alias);

        if (!isUnique) {
          set({ error: 'Alias is already taken' });
          set({ loading: false });
          return;
        }
      }

      const response = await q.post(`${API_URL}/shorten`, { originalUrl, expiresAt, alias });
      console.log(response);

      set({ loading: false });
    },
  }
}));

export const useMainActions = () => useMainStore(state => state.actions);
export const useShortedUrl = () => useMainStore(state => state.shortedUrl);
export const useExpiresAt = () => useMainStore(state => state.expiresAt);
export const useLoading = () => useMainStore(state => state.loading);
export const useError = () => useMainStore(state => state.error);
