import { create } from 'zustand';

type SelectedInsurance = {
  insuranceId: number;
  insuranceCompany: string;
  productName: string;
  sumInsured: number;
  monthlyCost?: string;
  memo?: string;
  createdAt: string;
  specialContractNames: string[];
  longTerm: boolean;
};

type CoverageStore = {
  selectedInsurance: SelectedInsurance | null;
  setSelectedInsurance: (item: SelectedInsurance) => void;
  clearSelectedInsurance: () => void;
};

export const useCoverageStore = create<CoverageStore>((set) => ({
  selectedInsurance: null,
  setSelectedInsurance: (item) => set({ selectedInsurance: item }),
  clearSelectedInsurance: () => set({ selectedInsurance: null })
}));
