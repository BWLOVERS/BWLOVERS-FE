import { create } from 'zustand';

export type SpecialContract = {
  contractId: number;
  contractName: string;
};

type SelectedInsurance = {
  insuranceId: number;
  insuranceCompany: string;
  productName: string;
  sumInsured: number;
  monthlyCost?: string;
  memo?: string;
  createdAt: string;
  longTerm: boolean;
  specialContracts: SpecialContract[];
  specialContractNames?: string[];
};

type CoverageStore = {
  selectedInsurance: SelectedInsurance | null;
  setSelectedInsurance: (item: SelectedInsurance) => void;
  clearSelectedInsurance: () => void;
};

export const useCoverageStore = create<CoverageStore>((set) => ({
  selectedInsurance: null,

  setSelectedInsurance: (item) =>
    set({
      selectedInsurance: {
        ...item,
        specialContractNames: item.specialContractNames?.length
          ? item.specialContractNames
          : item.specialContracts.map((c) => c.contractName)
      }
    }),

  clearSelectedInsurance: () => set({ selectedInsurance: null })
}));
