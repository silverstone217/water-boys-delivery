import { create } from "zustand";
import { User } from "../types/auth";

interface userState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<userState>()((set) => ({
  user: null,
  setUser: (auth: User | null) => set({ user: auth }),
}));
