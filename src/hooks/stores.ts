import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IStore {
  remember: string[];
  forget: string[];
  addRemember: (value: string) => void;
  addForget: (value: string) => void;
  reset: () => void;
}

const useFlashcardState = create<IStore>()(
  persist(
    (set) => ({
      remember: [],
      forget: [],
      addRemember: (value) =>
        set((state) => {
          const remember = [...state.remember, value];
          const forget = state.forget.filter((item) => item !== value);
          return {
            remember,
            forget,
          };
        }),
      addForget: (value) =>
        set((state) => {
          const forget = [...state.forget, value];
          const remember = state.remember.filter((item) => item !== value);
          return {
            remember,
            forget,
          };
        }),
      reset: () => set({ forget: [], remember: [] }),
    }),
    {
      name: "state-storage",
    }
  )
);

export { useFlashcardState };
