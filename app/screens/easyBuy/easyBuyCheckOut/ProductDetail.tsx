import routes from "@/app/navigations/routes";
import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

type RootStackParamList = {};

interface ProductDetailProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

type ProductDetailRouteProp = RouteProp<RootStackParamList>;

const ProductDetail: FunctionComponent<ProductDetailProps> = ({
  navigation,
}) => {
  const route = useRoute<ProductDetailRouteProp>();

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

          <View style={styles.description}>
            <AppText style={styles.descriptionTitle}>
              Category: {product.category.name}
            </AppText>
          </View>
          <View style={styles.description}>
            <AppText style={styles.descriptionTitle}>
              Product Description
            </AppText>

            <AppText style={styles.descriptionBody}>
              {product.description}
            </AppText>
          </View>
          <View style={styles.description}>
            <AppText style={styles.descriptionTitle}>Type</AppText>
            <AppText style={styles.descriptionTitle}>Available colors</AppText>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {product.color.map((color, index) => (
                <View
                  key={index}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: color,
                    borderWidth: 1,
                    borderColor: "#ccc",
                  }}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.btnContainer}>
        <AppButton
          titleStyle={[styles.titleStyle, { color: Colors.app.primary }]}
          btnContainerStyle={[styles.btn]}
          title="View Cart"
          onPress={() => navigation.navigate(routes.CARD_DETAIL as never)}
        />
      </View>
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
    width: "90%",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 5,
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
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontSize: 16,
    fontWeight: "900",
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
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    width: 336,
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
    zIndex: 10,
    position: "static",
    paddingVertical: 10,
  },
  specificationContainer: {
    width: "90%",
    marginBottom: 60,
  },
  btn: {
    backgroundColor: Colors.app.white,
    width: "40%",
    color: Colors.app.white,
    height: 50,
    borderColor: Colors.app.primary,
    borderWidth: 1,
    alignSelf: "flex-start",
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

export default ProductDetail;
