import easyBuy from "@/app/api/easyBuy";
import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import ErrorMessage from "@/components/custom/forms/ErrorMessage";
import IncrementDecrement from "@/components/custom/IncrementDecrement";
import List from "@/components/custom/list/List";
import LoadingModal from "@/components/custom/LoadingModal";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Checkbox from "expo-checkbox";
import { useFocusEffect } from "expo-router";
import React, { FunctionComponent, useCallback, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import routes from "../../../navigations/routes";

interface CartDetailProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

type RootStackParamList = {
  EasyBuyCheckOut: undefined;
};

export interface Price {
  $numberDecimal: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: Price;
  color: string[];
  isActive: boolean;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

export interface CartResponse {
  message: string;
  data: CartItem[];
  success: boolean;
}

// Define the overall response
export interface GetCartItemsResponse {
  data: CartItem[];
  message: string;
  success: boolean;
}

const CartDetail: FunctionComponent<CartDetailProps> = ({ navigation }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getCart = async () => {
    try {
      setLoading(true);
      const result = await easyBuy.getCart();


      if (result.ok) {
        const data = result.data as GetCartItemsResponse;

    
        // Extract only the products
        const products = data.data.map((item) => item.product);

        setCartItems(data.data);
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (error) {
      // logOut();
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.product.price.$numberDecimal); // convert to number

    return acc + price * item.quantity;
  }, 0);

  const deleteCart = async (productId: string) => {
    try {
      setLoading(true);
      const result = await easyBuy.deleteFromCart(productId);
      
      if (result.ok) {
        // Refresh the cart after successful deletion
        await getCart(); // 👈 this reloads the updated cart
      } else {
        throw new Error("Failed to delete item from cart");
      }
    } catch (error) {
   
      // logOut();
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getCart();
    }, [])
  );

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <View style={styles.container}>
        <View style={styles.heading}>
          <MaterialCommunityIcons
            name="arrow-left"
            color={Colors.app.black}
            size={20}
          />
          <AppText style={styles.headingTitle}>Cart Details</AppText>
          <View style={styles.selectAll}>
            <Checkbox
              value={isChecked}
              onValueChange={setIsChecked}
              color={isChecked ? Colors.app.primary : undefined}
              style={[styles.checkbox, { width: 14, height: 14 }]}
            />
            <AppText style={styles.selectAllLabel}>Select All</AppText>
          </View>
        </View>
        <View style={styles.contents}>
          <FlatList
            data={cartItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <List
                leftIcon={
                  <List
                    listStyle={{
                      paddingHorizontal: 20,
                      backgroundColor: Colors.app.white,
                      height: 80,
                      width: "100%",
                      alignSelf: "center",
                    }}
                    leftIcon={
                      <View style={styles.imgContainer}>
                        <Checkbox
                          value={isChecked}
                          onValueChange={setIsChecked}
                          color={isChecked ? Colors.app.primary : undefined}
                          style={styles.checkbox}
                        />
                        {/* <Image
                          style={styles.img}
                          source={{ uri: item.product. }}
                        /> */}
                      </View>
                    }
                    leftTopLabelStyle={styles.topLabel}
                    leftBottomLabelStyle={styles.bottomLabel}
                    leftTopLabel={item.product.name}
                    leftBottomLabel={`₦ ${item.product.price.$numberDecimal}`}
                    rightIcon={
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          padding: 10,
                        }}
                      >
                        <IncrementDecrement
                          quantity={item.quantity}
                          setLoading={(val) => setLoading(val)}
                          productId={item.product._id}
                          setErrorMessage={setErrorMessage}
                          onQuantityChange={getCart}
                        />
                        <TouchableOpacity
                          onPress={() => deleteCart(item.product._id)}
                        >
                          <AppText style={styles.remove}>Remove</AppText>
                        </TouchableOpacity>
                      </View>
                    }
                  />
                }
              />
            )}
          />
        </View>
      </View>
      <View style={styles.btnContainer}>
        <View
          style={{
            width: "45%",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "flex-start",
          }}
        >
          <AppText style={styles.total}>Total: </AppText>
          <AppText style={styles.amount}>₦{totalAmount.toFixed(2)}</AppText>
        </View>
        <AppButton
          titleStyle={styles.titleStyle}
          btnContainerStyle={[
            styles.btn,
            { backgroundColor: Colors.app.primary },
          ]}
          title="Checkout"
          onPress={() => navigation.navigate(routes.EASYBUT_CHECKOUT)}
        />
      </View>
      {loading && <LoadingModal visible={loading} />}

      {errorMessage && (
        <ErrorMessage error={errorMessage} visible={Boolean(errorMessage)} />
      )}
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
    justifyContent: "space-between",
    marginTop: 20,
    width: "95%",
    alignSelf: "center",
  },
  contents: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    gap: 16,
  },
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
    alignSelf: "center",
  },
  imgContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 5,
  },
  img: {
    width: 45,
    height: 45,
  },
  remove: {
    color: Colors.app.primary,
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  bottomLabel: {
    color: Colors.app.dark,
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
  },
  topLabel: {
    color: Colors.app.gray,
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  selectAll: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
  },
  selectAllLabel: {
    color: Colors.app.gray,
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
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
    zIndex: 10, // Ensure button is on top
    position: "absolute", // Overlay the list
    bottom: 190, // Stick to the bottom of the view
    paddingVertical: 15, // Add some padding to make it look natural
  },
  btn: {
    backgroundColor: Colors.app.white,
    width: "40%",
    color: Colors.app.white,
    height: 50,
    borderColor: Colors.app.primary,
    borderWidth: 1,
  },
  amount: {
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 28,
    alignSelf: "flex-start",
  },
  total: {
    color: Colors.app.gray,
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
    alignSelf: "flex-start",
  },
});

export default CartDetail;
