import { create } from "zustand";

import { q } from "@/utils";

const API_URL = import.meta.env.VITE_API_URL;

interface LinksActions {
  getAllLinks: () => Promise<void>;
  getInfo: (shortUrl: string) => Promise<void>;
  setInfo: (info: any) => void;
  getStat: (shortUrl: string) => Promise<void>;
  setStat: (stat: any) => void;
  deleteLink: (shortUrl: string) => Promise<void>;
};

interface LinksState {
  links: any[];
  info: any;
  stat: any;
  actions: LinksActions;
};

const useLinksStore = create<LinksState>((set, get) => ({
  links: [],
  info: null,
  stat: null,

  actions: {
    getAllLinks: async () => {
      const links = await q.get(`${API_URL}/links`);
      set({ links });
    },

    getInfo: async (alias: string) => {
      const link = get().links.find(l => l.alias === alias);

      if (!link?.info) {
        const info = await q.get(`${API_URL}/info/${alias}`);

        set(state => ({
          links: state.links.map(l => l.id === link.id ? { ...l, info } : l),
          info,
        }));
      } else {
        set({ info: link.info });
      }
    },

    setInfo: (info: any) => {
      set({ info });
    },

    getStat: async (alias: string) => {
      const link = get().links.find(l => l.alias === alias);

      if (!link?.stat) {
        const stat = await q.get(`${API_URL}/analytics/${alias}`);

        set(state => ({
          links: state.links.map(l => l.id === link.id ? { ...l, stat } : l),
          stat,
        }));
      } else {
        set({ stat: link.stat });
      }
    },

    setStat: (stat: any) => {
      set({ stat });
    },

    deleteLink: async (alias: string) => {
      await q.delete(`${API_URL}/delete/${alias}`);

      set(state => ({
        links: state.links.filter(link => link.alias !== alias),
      }));
    },
  }
}));

export const useLinksActions = () => useLinksStore(state => state.actions);
export const useLinks = () => useLinksStore(state => state.links);
export const useLinkInfo = () => useLinksStore(state => state.info);
export const useLinkStat = () => useLinksStore(state => state.stat);
