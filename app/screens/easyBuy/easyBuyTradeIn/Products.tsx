import easyBuy from "@/app/api/easyBuy";
import routes from "@/app/navigations/routes";
import Cart from "@/components/custom/easyBuy/Cart";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { FunctionComponent, useCallback, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";

type RootStackParamList = {
  ProductDetailWithCompare: { product: Product };
  ProductDetail: { product: Product };
  Products: { products: Product[] };
};

interface ProductsProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

export interface ProductCategory {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface Product {
  _id: string;
  partner: string;
  name: string;
  description: string;
  price: {
    $numberDecimal: string;
  };
  color: string[];
  isFeatured: boolean;
  category: ProductCategory;
  stock: number;
  image: string;
  imageUrl: string;
  additionalImages: string[];
  additionalImagesUrls: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  deactivatedByAdmin: boolean;
  isActive: boolean;
}

export interface ProductResponseData {
  status: number;
  message: string;
  data: Product[];
}

export interface GetAllProductsResponse {
  message: string;
  data: ProductResponseData;
  success: boolean;
}

const Products: FunctionComponent<ProductsProps> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([]).finally(() => setRefreshing(false));
  }, []);

  type ProductsRouteProp = RouteProp<RootStackParamList, "Products">;

  const route = useRoute<ProductsRouteProp>();

  let {
    products,
  }: {
    products: Product[];
  } = route.params;

  const createCart = async (product: Product) => {
    try {
      setRefreshing(true);
      navigation.navigate(routes.PRODUCT_DETAIL, {
        product,
      });
      const result = await easyBuy.addToCart(product._id);
      if (result.ok) {
        navigation.navigate(routes.PRODUCT_DETAIL, {
          product,
        });
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (error) {
      // logOut();
    } finally {
      setRefreshing(false);
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
    <Screen backgroundColor={Colors.app.white}>
      <View style={styles.container}>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Cart product={item} handleSelect={() => handleClick(item)} />
          )}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingTop: 10,
          }}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 16,
            gap: 10,
          }}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.app.screen,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default Products;
