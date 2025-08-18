import React, { createContext, ReactNode, useContext, useState } from "react";

// Single variation item structure
export interface SingleVariation {
  id: number;
  amount: number;
  size: string;
  validity: string;
}

// Variations grouped by type (GIFTING, SME, etc.)
export type PlanCategory = {
  [category: string]: SingleVariation[];
};

// Network-specific data (e.g., MTN, Airtel)
export type NetworkData = {
  [network: string]: PlanCategory;
};

// Context type
interface VariationContextType {
  variation: NetworkData;
  setVariation: (data: NetworkData) => void;
}

// Full API response structure for fetching all variations
export interface VariationsResponse {
  success: boolean;
  message: string;
  data: NetworkData;
}

// Create context
const VariationContext = createContext<VariationContextType | undefined>(
  undefined
);

// Provider props
interface VariationProviderProps {
  children: ReactNode;
}

// Provider
export const VariationProvider: React.FC<VariationProviderProps> = ({
  children,
}) => {
  const [variation, setVariationState] = useState<NetworkData>({});

  const setVariation = (data: NetworkData) => {
    setVariationState(data);
  };

  return (
    <VariationContext.Provider value={{ variation, setVariation }}>
      {children}
    </VariationContext.Provider>
  );
};

// Hook to use context
export const useVariation = (): VariationContextType => {
  const context = useContext(VariationContext);
  if (!context) {
    throw new Error("useVariation must be used within a VariationProvider");
  }
  return context;
};

export default VariationContext;
