import React, { createContext, ReactNode, useContext, useState } from "react";

// Define types for cart values
interface CartValues {
  _id?: string;
}

// Define context type
interface CartContextType {
  cartValues: CartValues;
  setCartValues: React.Dispatch<React.SetStateAction<CartValues>>;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider props
interface CartProviderProps {
  children: ReactNode;
}

// Cart Provider
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartValues, setCartValues] = useState<CartValues>({});

  return (
    <CartContext.Provider value={{ cartValues, setCartValues }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
