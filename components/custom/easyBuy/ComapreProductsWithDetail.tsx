import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { FunctionComponent, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import easyBuy from "../../../app/api/easyBuy";
import routes from "../../../app/navigations/routes";
import { Product } from "../../../app/screens/easyBuy/buyer/BuyerDashboard";
import AppButton from "../AppButton";
import AppText from "../AppText";
import List from "../list/List";

interface CompareProductsWithDetailProps {
  onPress?: () => void;
  showDetails?: boolean;
  id?: number;
  removeDetail?: (id: number) => void;
  product: Product | null;
  navigation?: any;
}

const CompareProductsWithDetail: FunctionComponent<
  CompareProductsWithDetailProps
> = ({
  onPress,
  showDetails = false,
  id,
  removeDetail,
  product,
  navigation,
}) => {
  const [loading, setLoading] = useState(false);

  const createCart = async (product: Product | null) => {
    try {
      setLoading(true);
      navigation.navigate(routes.PRODUCT_DETAIL, {
        product,
      });
      const result = await easyBuy.addToCart(product?._id || "");
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
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <List
        leftLabel="Choose product"
        rightIcon={
          <MaterialCommunityIcons
            name={showDetails ? "chevron-down" : "chevron-right"}
            color={Colors.app.primary}
            size={24}
            onPress={() => {
              if (!showDetails) {
             
                onPress?.();
              } else if (id !== undefined && removeDetail) {
                removeDetail(id);
              }
            }}
          />
        }
        listStyle={{
          height: 50,
          backgroundColor: Colors.app.white,
          padding: 10,
          borderRadius: 10,
          borderColor: Colors.app.input,
          borderWidth: 1,
          width: "90%",
          marginVertical: 10,
        }}
        onPress={() => {
          if (!showDetails) {
            onPress?.();
          } else if (id !== undefined && removeDetail) {
            removeDetail(id);
          }
        }}
      />

      {showDetails && (
        <>
          <Image
            style={styles.largeImage}
            source={{ uri: product?.imageUrl }}
          />
          <View style={styles.productDetails}>
            <AppText style={styles.productTitle}>{product?.name}</AppText>
            <AppText style={styles.productTitle}>
              Category: {product?.category.name}
            </AppText>
            <AppText style={styles.productTitle}>
              Number in stock: {product?.stock}
            </AppText>
            <AppText style={styles.productPrice}>
              ₦ {product?.price.$numberDecimal} or Installment Plan
            </AppText>
            <View style={styles.description}>
              <AppText style={styles.descriptionTitle}>
                Product Description
              </AppText>
              <View>
                <AppText
                  numberOfLines={6}
                  ellipsizeMode="tail" // Cut text at the END instead of the beginning
                  style={styles.descriptionBody}
                >
                  {product?.description}
                </AppText>
              </View>
            </View>
            <AppText style={styles.productSpecification}>
              Specifications
            </AppText>

            <View style={styles.btnContainer}>
              <AppButton
                titleStyle={[styles.titleStyle, { color: Colors.app.primary }]}
                btnContainerStyle={[styles.btn]}
                title="View Product"
                onPress={() =>
                  navigation.navigate(routes.PRODUCT_DETAIL_WITH_COMPARE, {
                    product,
                  })
                }
              />
              <AppButton
                titleStyle={styles.titleStyle}
                btnContainerStyle={[
                  styles.btn,
                  { backgroundColor: Colors.app.primary },
                ]}
                title="Add To Card"
                onPress={() => createCart(product)}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    gap: 10,
  },
  headingTitle: {
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontSize: 18,
    fontWeight: "600",
    height: 26,
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 90,
    marginTop: 20,
    width: "90%",
  },
  productDetails: {
    width: "90%",
    justifyContent: "center",
    gap: 5,
    backgroundColor: Colors.app.white,
    padding: 10,
  },
  productSuggestion: {
    color: Colors.app.dark,
    fontFamily: "DM Sans",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 20,
    alignSelf: "flex-start",
  },
  productPrice: {
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 28,
  },
  descriptionTitle: {
    color: Colors.app.gray,
    fontFamily: "DM Sans",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
  },
  description: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    gap: 8,
  },
  productTitle: {
    color: Colors.app.gray,
    fontFamily: "DM Sans",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
  },
  descriptionBody: {
    color: Colors.app.gray,
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    maxWidth: "100%", // Allows text to adjust dynamically
    flexWrap: "wrap",
    overflow: "hidden",
    textAlign: "left",
  },
  item: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  bullet: { fontSize: 20, marginRight: 5 },
  specificationLabel: {
    color: Colors.app.gray,
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  productSpecification: {
    color: Colors.app.dark,
    fontFamily: "DM Sans",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 20,
    alignSelf: "flex-start",
  },
  specificationValue: {
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  specificationContainer: {
    width: "90%",
  },
  titleStyle: {
    fontSize: 14,
    color: Colors.app.white,
    fontWeight: "500",
    fontStyle: "normal",
    fontFamily: "DM Sans",
    lineHeight: 20,
  },
  btnContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    alignSelf: "center",
    backgroundColor: Colors.app.white,
  },
  btn: {
    backgroundColor: Colors.app.white,
    width: "40%",
    color: Colors.app.white,
    height: 50,
    borderColor: Colors.app.primary,
    borderWidth: 1,
  },
  largeImage: {
    width: 250, // or increase as needed
    height: 220,
    borderRadius: 10,
  },
});

export default CompareProductsWithDetail;
