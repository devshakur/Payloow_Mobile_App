import AppText from "@/components/custom/AppText";
import ButtonWithIcon from "@/components/custom/ButtonWithIcon";
import List from "@/components/custom/list/List";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import { EvilIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect } from "expo-router";
import React, { FunctionComponent, useCallback, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import ErrorModal from "../../../../components/custom/ErrorModal";
import LoadingModal from "../../../../components/custom/LoadingModal";
import SuccessModal from "../../../../components/custom/SuccessModal";
import easyBuy from "../../../api/easyBuy";
import routes from "../../../navigations/routes";
import { CartItem, GetCartItemsResponse } from "./CartDetail";

type RootStackParamList = {
  InstallmentPlan: undefined;
};

interface EasyBuyCheckOutProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const EasyBuyCheckOut: FunctionComponent<EasyBuyCheckOutProps> = ({
  navigation,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

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

  const handlePaystack = async () => {
    // Implement Paystack logic here
    
    try {
      setLoading(true);
      const paymentMethod = "paystack";
      const result = await easyBuy.checkOut(paymentMethod);

   

      if (result.ok) {
        const data = result.data as any;
        setResponseMessage("");
        showModal("error");
      } else {
        setResponseMessage("");
        showModal("error");
      }
    } catch (error) {
      // logOut();
    } finally {
      setLoading(false);
    }
  };

  const handleWallet = async () => {
    // TODO: Implement Wallet logic here
 

    try {
      setLoading(true);
      const paymentMethod = "wallet";
      const result = await easyBuy.checkOut(paymentMethod);

   

      if (result.ok) {
        const data = result.data as any;
        setResponseMessage("");
        showModal("error");
      } else {
        setResponseMessage("");
        showModal("error");
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

  const showModal = (modalName: string) => {
    setCurrentModal(modalName);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setCurrentModal(null);
  };
  return (
    <Screen backgroundColor={Colors.app.screen}>
      <View style={styles.container}>
        <View style={styles.heading}>
          <MaterialCommunityIcons
            name="arrow-left"
            color={Colors.app.black}
            size={20}
          />
          <AppText style={styles.headingTitle}>Check Out</AppText>
        </View>
      </View>
      <View style={styles.contents}>
        <List
          listStyle={{
            padding: 10,
            backgroundColor: Colors.app.white,
            height: 80,
            width: "100%",
          }}
          leftIcon={
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                alignSelf: "flex-start",
                gap: 5,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  alignSelf: "flex-start",
                }}
              >
                <EvilIcons name="location" size={24} color="black" />
                <AppText style={styles.buyer}>Salim Hussain</AppText>
              </View>
              <AppText style={styles.address}>
                House No. 32, Ahmadu Bello Road. Kano state, Nigeria
              </AppText>
            </View>
          }
          rightIcon={
            <MaterialCommunityIcons
              name="chevron-right"
              color={Colors.app.black}
              size={24}
            />
          }
        />

        <View
          style={{
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            alignSelf: "center",
          }}
        >
          <AppText style={styles.orderLabel}>Your Order</AppText>
         
        </View>

        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.product._id}
          contentContainerStyle={{ width: "100%" }}
          renderItem={({ item }) => (
            <List
              listStyle={{
                padding: 12,
                backgroundColor: Colors.app.white,
                height: 80,
                width: "100%",
              }}
              leftTopLabelStyle={styles.topLabel}
              leftBottomLabelStyle={styles.bottomLabel}
              leftTopLabel={item.product.name}
              leftBottomLabel={`₦ ${item.product.price.$numberDecimal}`}
            />
          )}
        />

        <AppText style={styles.title}>Payment Option</AppText>
        <View style={styles.btnContainer}>
          <ButtonWithIcon
            titleStyle={styles.titleStyle}
            btnContainerStyle={styles.btn}
            title="Full payment"
            onPress={() => {
              Alert.alert(
                "Select Payment Method",
                "Choose how you want to complete the payment.",
                [
                  {
                    text: "Paystack",
                    onPress: () => handlePaystack(),
                  },
                  {
                    text: "Wallet",
                    onPress: () => handleWallet(),
                  },
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                ],
                { cancelable: true }
              );
            }}
          />
          <ButtonWithIcon
            titleStyle={styles.titleStyle}
            btnContainerStyle={styles.btn}
            title="Installment"
            onPress={() => navigation.navigate(routes.INSTALLMENT_PLAN)}
          />
        </View>
      </View>
      {currentModal === "error" && (
        <ErrorModal
          visible={modalVisible}
          onClose={() => {
            hideModal();
          }}
          responseText={responseMessage || "Submission failed"}
        />
      )}
      {currentModal === "success" && (
        <SuccessModal
          visible={modalVisible}
          onClose={() => {
            hideModal();
          }}
          responseText={responseMessage || "Successful"}
        />
      )}
      {loading && <LoadingModal visible={loading} />}
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
    justifyContent: "flex-start",
    marginTop: 20,
    width: "90%",
    gap: 90,
  },
  contents: {
    width: "95%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    gap: 10,
    marginTop: 10,
  },
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  address: {
    color: Colors.app.gray,
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    width: 264,
  },
  buyer: {
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  orderLabel: {
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  hide: {},

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
  right: {
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontSize: 14,
    fontWeight: "500",
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
    borderRadius: 10,
  },
  btn: {
    backgroundColor: Colors.app.primary,
    width: "45%",
    color: Colors.app.white,
    height: 50,
    borderColor: Colors.app.primary,
    borderWidth: 1,
    gap: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 10,
  },
  title: {
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    alignSelf: "flex-start",
  },
  imgContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
});

export default EasyBuyCheckOut;
