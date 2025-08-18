import routes from "@/app/navigations/routes";
import AppText from "@/components/custom/AppText";
import ButtonWithIcon from "@/components/custom/ButtonWithIcon";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { FunctionComponent } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Product } from "../easyBuyTradeIn/Products";

type RootStackParamList = {
  CompareFeatureScreen: undefined;
  ProductDetailWithCompare: { product: Product }; // <-- updated
};

type ProductDetailWithCompareRouteProp = RouteProp<
  RootStackParamList,
  "ProductDetailWithCompare"
>;

interface ProductDetailWithCompareProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const ProductDetailWithCompare: FunctionComponent<
  ProductDetailWithCompareProps
> = ({ navigation }) => {
  const route = useRoute<ProductDetailWithCompareRouteProp>();

  let {
    product,
  }: {
    product: Product;
  } = route.params ?? {};

  const [mainImage, setMainImage] = React.useState(product.imageUrl);

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heading}>
          <MaterialCommunityIcons
            name="arrow-left"
            color={Colors.app.black}
            size={20}
          />
          <AppText style={styles.headingTitle}>Product Details</AppText>
        </View>

        <View style={styles.productImages}>
          <Image
            resizeMode="contain"
            style={styles.largeImage}
            source={{ uri: mainImage }}
          />
          <View style={styles.smallImages}>
            <TouchableOpacity
              onPress={() => setMainImage(product.additionalImagesUrls[1])}
            >
              <Image
                style={styles.smallImage}
                source={{ uri: product.additionalImagesUrls[1] }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMainImage(product.additionalImagesUrls[1])}
            >
              <Image
                style={styles.smallImage}
                source={{ uri: product.additionalImagesUrls[1] }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMainImage(product.additionalImagesUrls[0])}
            >
              <Image
                style={styles.smallImage}
                source={{ uri: product.additionalImagesUrls[0] }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMainImage(product.additionalImagesUrls[0])}
            >
              <Image
                style={styles.smallImage}
                source={{ uri: product.additionalImagesUrls[0] }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.productDetails}>
          <AppText style={styles.productTitle}>{product.name}</AppText>
          <AppText style={styles.productTitle}>
            Category: {product.category.name}
          </AppText>
          <AppText style={styles.productTitle}>
            Number in stock: {product.stock}
          </AppText>
          <AppText style={styles.productPrice}>
            ₦ {product.price.$numberDecimal} or Installment Plan
          </AppText>
          <AppText style={styles.productSuggestion}>
            Suggested payments with 6 months special financing
          </AppText>
          <View style={styles.btnContainer}>
            <ButtonWithIcon
              icon={
                <MaterialCommunityIcons
                  name="compare"
                  size={24}
                  titleStyle={styles.titleStyle}
                  color={Colors.app.primary}
                />
              }
              titleStyle={styles.titleStyle}
              btnContainerStyle={styles.btn}
              title="Compare"
              onPress={() => navigation.navigate(routes.COMPARE_FEATURE_SCREEN)}
            />
            <ButtonWithIcon
              icon={
                <FontAwesome6
                  name="arrow-rotate-right"
                  size={24}
                  color={Colors.app.primary}
                />
              }
              titleStyle={styles.titleStyle}
              btnContainerStyle={styles.btn}
              title="360 View"
            />
          </View>
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
                {product.description}
              </AppText>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  contentContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    gap: 30,
    paddingBottom: 20,
    width: "90%",
    alignSelf: "center",
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
  productImages: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  smallImages: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  smallImage: {
    width: 60,
    height: 60,
    backgroundColor: Colors.app.productImgBg,
    borderRadius: 10,
  },
  largeImage: {
    width: 250,
    height: 220,
    borderRadius: 10,
  },
  productDetails: {
    width: "100%",
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

  titleStyle: {
    fontSize: 14,
    color: Colors.app.black,
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
    borderRadius: 10,
  },
  specificationContainer: {
    width: "90%",
    marginBottom: 60, // Ensure some part of the list is hidden under the button
  },
  btn: {
    backgroundColor: Colors.app.white,
    width: "45%",
    color: Colors.app.white,
    height: 50,
    borderColor: Colors.app.light,
    borderWidth: 1,
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
});

export default ProductDetailWithCompare;
