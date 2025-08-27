import easyBuy from "@/app/api/easyBuy";
import { useUser } from "@/app/context/UserProvider";
import AppText from "@/components/custom/AppText";
import {
  CategoriesResponse,
  Data,
} from "@/components/custom/easyBuy/AddProduct";
import CategoryCard from "@/components/custom/easyBuy/categoryCard";
import FeatureProduct from "@/components/custom/easyBuy/FeatureProduct";
import SearchProductModal from "@/components/custom/easyBuy/SearchProductModal";
import Screen from "@/components/custom/Screen";
import SearchBar from "@/components/custom/SearchBar";
import { Colors } from "@/constants/Colors";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import routes from "../../../navigations/routes";
import {
  Product,
  ProductDataWrapper,
  ProductResponseData,
} from "../buyer/BuyerDashboard";
import { GetAllProductsResponse } from "./Products";

type RootStackParamList = {
  ProductDetailWithCompare: { product: Product };
  ProductDetail: { product: Product };
  Products: { products: Product[] };
  PartnerProducts: { products: Product[] };
};

interface CategoriesPageProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const CategoriesPage: FunctionComponent<CategoriesPageProps> = ({
  navigation,
}) => {
  const { user } = useUser();
  const [isPartnerProducts, setIsPartnerProducts] = useState(false);
  const [filteredProductsArray, setFilteredProducts] = useState<Product[]>([]);
  const [isSearchProduct, setIsSearchProduct] = useState(false);
  const [alertAnswered, setAlertAnswered] = useState(false);
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    Promise.all([
      fetchProducts(), // added here
    ]).finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (user?.data.easyBuyRole === "partner") {
        setAlertAnswered(false);
        Alert.alert(
          "Where do you want to go?",
          "Choose a screen to navigate to:",
          [
            {
              text: "Explore Products",
              onPress: () => {
                setIsPartnerProducts(false);
                setAlertAnswered(true);
              },
            },
            {
              text: "My Products",
              onPress: () => {
                setIsPartnerProducts(true);
                setAlertAnswered(true);
              },
            },
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => {
                setAlertAnswered(true);
              },
            },
          ],
          { cancelable: true }
        );
      } else {
        // For non-partners, skip the alert
        setAlertAnswered(true);
        setIsPartnerProducts(false); // default to explore
      }
    }, [user])
  );

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
      setRefreshing(true);
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

  const getCategories = async () => {
    try {
      setRefreshing(true);
      const result = await easyBuy.getCategories();
      if (result.ok) {
        const data = (result.data as CategoriesResponse).data as Data[];
        const formatted = data.map((category) => ({
          label: category.name,
          value: String(category._id),
        }));

        setCategories([...formatted]);
      } else {
        throw new Error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchProducts = async () => {
    setRefreshing(true);
    try {
      const result = await easyBuy.getProducts();
      const response = result.data as ProductResponseData;

      const responseData = response.data as ProductDataWrapper;

      if (result.ok) {
        const productList = responseData.data;

        setFilteredProducts(productList);
      } else {
      }
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  const fetchProductByCategory = async (categoryId: string) => {
    setRefreshing(true);
    try {
      const result = isPartnerProducts
        ? await easyBuy.getPartnerProductsByCategory(categoryId)
        : await easyBuy.getProducts();

      const data = result.data as GetAllProductsResponse;
      if (result.ok) {
        setFilteredProducts(data.data.data);
        navigation.navigate(
          isPartnerProducts ? "PartnerProducts" : "Products",
          { products: data.data.data }
        );
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  if (!alertAnswered) {
    return (
      <AppText style={{ textAlign: "center", marginTop: 50 }}>
        Waiting for input...
      </AppText>
    );
  }

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <AppText style={styles.upperTitle}>Explore</AppText>
            <AppText style={styles.lowerTitle}>
              What do you want to buy today?
            </AppText>
          </View>

          <SearchBar onPress={() => setIsSearchProduct(true)} />

          <View style={styles.categoriesContainer}>
            <FlatList
              data={categories}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <CategoryCard
                  image={require("../../../../assets/images/custom/category.png")}
                  label={item.label}
                  onPress={() => fetchProductByCategory(item.value)}
                />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10 }}
              ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
            />
          </View>

          <View style={styles.recommendation}>
            <View style={styles.recommendationTitleContainer}>
              <AppText style={styles.recommendationContentsTitle}>
                Recommended
              </AppText>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(routes.PRODUCTS, {
                    products: filteredProductsArray,
                  })
                }
              >
                <AppText style={styles.viewAll}>View all</AppText>
              </TouchableOpacity>
            </View>
            <FeatureProduct
              onRefreshing={(value) => (value === true ? onRefresh() : {})}
              navigation={navigation}
              products={filteredProductsArray}
            />
          </View>
        </View>

        {isSearchProduct && (
          <SearchProductModal
            handleCardSelect={(product) => handleClick(product)}
            onClose={() => setIsSearchProduct(false)}
          />
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    width: "100%",
    gap: 30,
    height: "auto",
  },
  categoriesContainer: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    gap: 20,
    alignSelf: "center",
  },
  recommendation: {
    width: "90%",
  },
  viewAll: {
    color: Colors.app.primary,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  recommendationContentsTitle: {
    color: Colors.app.black,
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "DM Sans",
    lineHeight: 24,
  },
  recommendationTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "90%",
    marginTop: 10,
  },
  upperTitle: {
    color: Colors.app.black,
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "DM Sans",
    lineHeight: 28,
    alignSelf: "flex-start",
  },
  lowerTitle: {
    color: Colors.app.black,
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "DM Sans",
    lineHeight: 20,
    alignSelf: "flex-start",
  },
});

export default CategoriesPage;
