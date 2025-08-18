import useAuth from "@/app/auth/useAuth";
import routes from "@/app/navigations/routes";
import { Colors } from "@/constants/Colors";
import React, { FunctionComponent } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import easyBuy from "../../../app/api/easyBuy";
import { Product } from "../../../app/screens/easyBuy/buyer/BuyerDashboard";
import Cart from "./Cart";

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
    } finally {
      onRefreshing(true);
    }
  };

  const handleClick = (product: Product) => {
    Alert.alert(
      "Where do you want to go?",
      "Choose a screen to navigate to:",
      [
        {
          text: "Show details",
          onPress: () =>
            navigation.navigate(routes.PRODUCT_DETAIL_WITH_COMPARE, {
              product,
            }),
        },
        {
          text: "Show details and add to cart",
          onPress: () => createCart(product),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        horizontal
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Cart product={item} handleSelect={() => handleClick(item)} />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.app.screen,
    gap: 2,
  },
});

export default FeatureProduct;
