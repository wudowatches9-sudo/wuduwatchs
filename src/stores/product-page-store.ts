import { create } from 'zustand';

type ColorSelection = string | { name: string; hex: string } | null;

interface ProductPageState {
  selectedSize: string | null;
  selectedColor: ColorSelection;
  setSelectedSize: (size: string) => void;
  setSelectedColor: (color: ColorSelection) => void;
  reset: () => void;
}

export const useProductPageStore = create<ProductPageState>((set) => ({
  selectedSize: null,
  selectedColor: null,
  setSelectedSize: (size) => set({ selectedSize: size }),
  setSelectedColor: (color) => set({ selectedColor: color }),
  reset: () => set({ selectedSize: null, selectedColor: null }),
}));
