import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FulfillmentOption, Branch } from '../types';

interface FulfillmentStore {
  selectedOption: FulfillmentOption | null;
  selectedBranch: Branch | null;
  setFulfillmentOption: (option: FulfillmentOption) => void;
  setBranch: (branch: Branch) => void;
  clearFulfillment: () => void;
  getEstimatedTime: () => string;
  getDeliveryFee: () => number;
  getMinimumOrder: () => number;
}

export const useFulfillmentStore = create<FulfillmentStore>()(
  persist(
    (set, get) => ({
      selectedOption: null,
      selectedBranch: null,

      setFulfillmentOption: (option) => {
        set({ selectedOption: option });
      },

      setBranch: (branch) => {
        set({ selectedBranch: branch });
      },

      clearFulfillment: () => {
        set({ selectedOption: null, selectedBranch: null });
      },

      getEstimatedTime: () => {
        const { selectedOption, selectedBranch } = get();
        if (!selectedOption || !selectedBranch) return '';
        
        return selectedOption.type === 'delivery' 
          ? selectedBranch.estimatedDeliveryTime 
          : selectedBranch.estimatedPickupTime;
      },

      getDeliveryFee: () => {
        const { selectedOption, selectedBranch } = get();
        if (!selectedOption || !selectedBranch) return 0;
        
        return selectedOption.type === 'delivery' ? selectedBranch.deliveryFee : 0;
      },

      getMinimumOrder: () => {
        const { selectedBranch } = get();
        return selectedBranch?.minimumOrder || 0;
      },
    }),
    {
      name: 'fulfillment-storage',
    }
  )
);
