import useAuth from "@/app/auth/useAuth";
import routes from "@/app/navigations/routes";
import SkeletonProductCard from "@/components/SkeletonProductCard";
import { Colors } from "@/constants/Colors";
import { FunctionComponent } from "react";
import { FlatList, StyleSheet, View } from "react-native";
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
        // 👉 Use FlatList (not ScrollView) for skeletons to avoid VirtualizedList nesting errors
        <FlatList
          data={[1, 2, 3, 4]}
          keyExtractor={(item) => item.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={() => <SkeletonProductCard />}
          contentContainerStyle={{ paddingHorizontal: 8 }}
        />
      ) : (
        <AutoScrollRow
          products={products}
          speed={0.5} // tweak to taste; higher = faster
          reverse={false} // set true to flip direction
          spacing={20} // space between repeated groups
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
