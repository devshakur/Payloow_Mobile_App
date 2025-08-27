import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Product,
  ProductDataWrapper,
  ProductResponseData,
} from "../screens/easyBuy/buyer/BuyerDashboard";

import easyBuy from "../api/easyBuy";

// Define context shape
interface ProductsContextType {
  products: Product[];
  setProducts: (data: Product[]) => void;
  loading: boolean;
}

// Create context
const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

// Provider props
interface ProductsProviderProps {
  children: ReactNode;
}

// Provider implementation
export const ProductsProvider: React.FC<ProductsProviderProps> = ({
  children,
}) => {
  const [products, setProductsState] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const setProducts = (data: Product[]) => {
    setProductsState(data);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await easyBuy.getProducts();
        const response = result.data as ProductResponseData;

        const responseData = response.data as ProductDataWrapper;

        if (result.ok) {
          const productList = responseData.data;

          setProducts(productList);
        } else {
        }
      } catch (error) {
     
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, setProducts, loading }}>
      {children}
    </ProductsContext.Provider>
  );
};

// Hook to consume
export const useProducts = (): ProductsContextType => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};

export default ProductsProvider;
