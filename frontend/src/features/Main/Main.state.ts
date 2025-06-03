import { q } from "@/utils";
import { create } from "zustand";

interface MainActions {
  setAlias: (alias: string) => void;
  setExpiresAt: (expiresAt: Date | null) => void;
  setUrl: (originalUrl: string) => void;
  checkAlias: (alias: string) => Promise<void>;
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
      const response = await fetch(`/api/alias/check/${alias}`).then(res => res.json());
      console.log("checkAlias", response);
    },

    cutUrl: async () => {
      const { originalUrl, alias, expiresAt } = get();
      set({ loading: true, error: null });

      const response = await q.post('http://localhost:3001/shorten', { originalUrl, expiresAt, alias });

      console.log(response);
    },
  }
}));

export const useMainActions = () => useMainStore(state => state.actions);
export const useShortedUrl = () => useMainStore(state => state.shortedUrl);
export const useExpiresAt = () => useMainStore(state => state.expiresAt);
export const useLoading = () => useMainStore(state => state.loading);
export const useError = () => useMainStore(state => state.error);
