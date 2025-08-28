import useAuth from "@/app/auth/useAuth";
import routes from "@/app/navigations/routes";
import SkeletonProductCard from "@/components/SkeletonProductCard";
import { Colors } from "@/constants/Colors";
import { FunctionComponent } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import easyBuy from "../../../app/api/easyBuy";
import { Product } from "../../../app/screens/easyBuy/buyer/BuyerDashboard";
import AutoScrollRow from "./AutoScrollRow";

interface FeatureProductProps {
  navigation?: any;
  onRefreshing: (value: boolean) => void;
  products: Product[];
}

const FeatureProduct: FunctionComponent<FeatureProductProps> = ({
  navigation,
  onRefreshing,
  products,
}) => {
  const { logOut } = useAuth();

  const createCart = async (product: Product) => {
    try {
      navigation.navigate(routes.PRODUCT_DETAIL, { product });

      const result = await easyBuy.addToCart(product._id);

      if (result.ok) {
        navigation.navigate(routes.PRODUCT_DETAIL, { product });
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (error) {
      console.log(error);
    } finally {
      onRefreshing(true);
    }
  };

  const handleClick = () => {
    console.log("hello");
  };

  return (
    <View style={styles.container}>
      {!products || products.length === 0 ? (
        // Use ScrollView instead of FlatList to avoid VirtualizedList nesting
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8 }}
        >
          {[1, 2, 3, 4].map((item) => (
            <SkeletonProductCard key={item.toString()} />
          ))}
        </ScrollView>
      ) : (
        <AutoScrollRow
          products={products}
          speed={0.5} 
          reverse={false}
          spacing={20}
          handleSelect={handleClick}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.app.screen,
    gap: 2,
    marginBottom: 20,
  },
});

export default FeatureProduct;
