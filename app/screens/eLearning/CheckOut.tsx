import AppText from "@/components/custom/AppText";
import List from "@/components/custom/list/List";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { FunctionComponent, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import AppButton from "../../../components/custom/AppButton";

interface CheckOutProps {}

const CheckOut: FunctionComponent<CheckOutProps> = () => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <Screen backgroundColor={Colors.app.screen}>
      <View style={styles.heading}>
        <MaterialCommunityIcons
          name="arrow-left"
          color={Colors.app.black}
          size={20}
        />
        <AppText style={styles.headingTitle}>Check Out</AppText>
      </View>

      <View
        style={{
          width: "90%",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          alignSelf: "center",
          marginVertical: 10,
        }}
      >
        <AppText style={styles.orderLabel}>Your Order</AppText>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            alignSelf: "center",
          }}
        >
          <AppText style={{}}>Hide</AppText>
          <MaterialCommunityIcons
            name="chevron-down"
            color={Colors.app.black}
            size={24}
          />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.contents}>
        <List
          listStyle={{
            padding: 12,
            backgroundColor: Colors.app.white,
            height: 80,
            width: "100%",
          }}
          leftIcon={
            <Image
              source={require("../../../assets/images/custom/products/list-iphone.png")}
            />
          }
          leftTopLabelStyle={styles.topLabel}
          leftBottomLabelStyle={styles.bottomLabel}
          leftTopLabel="HTML/CSS"
          leftBottomLabel="₦ 300,000"
          rightLabel="Programming"
          rightLabelStyle={styles.right}
        />
        <List
          listStyle={{
            padding: 12,
            backgroundColor: Colors.app.white,
            height: 80,
            width: "100%",
          }}
          leftIcon={
            <Image
              source={require("../../../assets/images/custom/products/list-iphone.png")}
            />
          }
          leftTopLabelStyle={styles.topLabel}
          leftBottomLabelStyle={styles.bottomLabel}
          leftTopLabel="HTML/CSS"
          leftBottomLabel="₦ 300,000"
          rightLabel="Programming"
          rightLabelStyle={styles.right}
        />
        <List
          listStyle={{
            padding: 12,
            backgroundColor: Colors.app.white,
            height: 80,
            width: "100%",
          }}
          leftIcon={
            <Image
              source={require("../../../assets/images/custom/products/list-iphone.png")}
            />
          }
          leftTopLabelStyle={styles.topLabel}
          leftBottomLabelStyle={styles.bottomLabel}
          leftTopLabel="HTML/CSS"
          leftBottomLabel="₦ 300,000"
          rightLabel="Programming"
          rightLabelStyle={styles.right}
        />
        <List
          listStyle={{
            padding: 12,
            backgroundColor: Colors.app.white,
            height: 80,
            width: "100%",
          }}
          leftIcon={
            <Image
              source={require("../../../assets/images/custom/products/list-iphone.png")}
            />
          }
          leftTopLabelStyle={styles.topLabel}
          leftBottomLabelStyle={styles.bottomLabel}
          leftTopLabel="HTML/CSS"
          leftBottomLabel="₦ 300,000"
          rightLabel="Programming"
          rightLabelStyle={styles.right}
        />
        <List
          listStyle={{
            padding: 12,
            backgroundColor: Colors.app.white,
            height: 80,
            width: "100%",
          }}
          leftIcon={
            <Image
              source={require("../../../assets/images/custom/products/list-iphone.png")}
            />
          }
          leftTopLabelStyle={styles.topLabel}
          leftBottomLabelStyle={styles.bottomLabel}
          leftTopLabel="HTML/CSS"
          leftBottomLabel="₦ 300,000"
          rightLabel="Programming"
          rightLabelStyle={styles.right}
        />
        <List
          listStyle={{
            padding: 12,
            backgroundColor: Colors.app.white,
            height: 80,
            width: "100%",
          }}
          leftIcon={
            <Image
              source={require("../../../assets/images/custom/products/list-iphone.png")}
            />
          }
          leftTopLabelStyle={styles.topLabel}
          leftBottomLabelStyle={styles.bottomLabel}
          leftTopLabel="HTML/CSS"
          leftBottomLabel="₦ 300,000"
          rightLabel="Programming"
          rightLabelStyle={styles.right}
        />

        <AppButton
          titleStyle={styles.titleStyle}
          btnContainerStyle={[
            styles.btn,
            { backgroundColor: Colors.app.primary },
          ]}
          title="Checkout"
        />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  headingTitle: {
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontSize: 18,
    fontWeight: "900",
    height: 26,
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 20,
    width: "90%",
    gap: 90,
    padding: 15,
  },
  contents: {
    width: "95%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    gap: 10,
    marginTop: 10,
    marginBottom: 20,
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
    fontSize: 18,
    color: Colors.app.white,
    fontWeight: "900",
    fontStyle: "normal",
    fontFamily: "DM Sans",
    lineHeight: 20,
  },
  btn: {
    backgroundColor: Colors.app.white,
    width: "100%",
    color: Colors.app.white,
    height: 50,
    borderColor: Colors.app.white,
    borderWidth: 1,
    gap: 10,
    marginBottom: 20,
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
});

export default CheckOut;
