import { create } from "zustand";

interface propsTypes {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
export const useDialogModel = create<propsTypes>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
