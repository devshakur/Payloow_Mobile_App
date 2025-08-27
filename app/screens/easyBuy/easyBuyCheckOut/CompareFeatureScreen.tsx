import AppText from "@/components/custom/AppText";
import CompareProductsWithDetail from "@/components/custom/easyBuy/ComapreProductsWithDetail";
import SearchProductModal from "@/components/custom/easyBuy/SearchProductModal";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { FunctionComponent, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Product } from "../easyBuyTradeIn/Products";

type RootStackParamList = {};

interface CompareFeatureScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const CompareFeatureScreen: FunctionComponent<CompareFeatureScreenProps> = ({
  navigation,
}) => {
  const [isSearchProduct, setIsSearchProduct] = useState(false);
  const [displayCards, setDisplayCards] = useState<{
    [key: number]: Product | null;
  }>({});
  const [activeCardSlot, setActiveCardSlot] = useState<number | null>(null);

  const handleCardSelect = (product: Product) => {
    if (activeCardSlot !== null) {
      setDisplayCards((prev) => ({
        ...prev,
        [activeCardSlot]: product,
      }));
    }
    setIsSearchProduct(false);
    setActiveCardSlot(null);
  };

  const removeDetail = (id: number) => {
    setDisplayCards((prev) => {
      const newCards = { ...prev };
      newCards[id] = null;
      return newCards;
    });
  };

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
        <View style={styles.contents}>
          <CompareProductsWithDetail
            id={1}
            onPress={() => {
              setActiveCardSlot(1);
              setIsSearchProduct(true);
            }}
            removeDetail={() => removeDetail(1)}
            showDetails={!!displayCards[1]} // Boolean
            product={displayCards[1]}
            navigation={navigation}
          />
          <CompareProductsWithDetail
            id={2}
            onPress={() => {
              setActiveCardSlot(2);
              setIsSearchProduct(true);
            }}
            removeDetail={() => removeDetail(2)}
            showDetails={!!displayCards[2]}
            product={displayCards[2]}
            navigation={navigation}
          />
          <CompareProductsWithDetail
            id={3}
            onPress={() => {
              setActiveCardSlot(3);
              setIsSearchProduct(true);
            }}
            removeDetail={() => removeDetail(3)}
            showDetails={!!displayCards[3]}
            product={displayCards[3]}
            navigation={navigation}
          />
        </View>
        {isSearchProduct && (
          <SearchProductModal
            handleCardSelect={(product) => handleCardSelect(product)}
            onClose={() => setIsSearchProduct(false)}
          />
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
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
  container: {
    width: "100%",
  },
  contents: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
  },
  contentContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    gap: 10,
    paddingBottom: 20,
    backgroundColor: Colors.app.screen,
  },
});

export default CompareFeatureScreen;
