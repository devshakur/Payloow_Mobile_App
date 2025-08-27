import React, { createContext, ReactNode, useContext, useState } from "react";

// Define the shape of the context
interface ScreenContextType {
  module: string;
  setModule: (module: string) => void;
  dashboard: string;
  setDashboard: (dashboard: string) => void;
}

// Create Screen Context with default values
const ScreenContext = createContext<ScreenContextType | undefined>(undefined);

// ScreenProvider Props
interface ScreenProviderProps {
  children: ReactNode;
}

// ScreenProvider Component
export const ScreenProvider: React.FC<ScreenProviderProps> = ({ children }) => {
  const [module, setModule] = useState<string>("Home");
  const [dashboard, setDashboard] = useState<string>("Home");

  return (
    <ScreenContext.Provider
      value={{ module, setModule, dashboard, setDashboard }}
    >
      {children}
    </ScreenContext.Provider>
  );
};

// Custom Hook
export const useScreen = (): ScreenContextType => {
  const context = useContext(ScreenContext);
  if (!context) {
    throw new Error("useScreen must be used within a ScreenProvider");
  }
  return context;
};

export default ScreenContext;
