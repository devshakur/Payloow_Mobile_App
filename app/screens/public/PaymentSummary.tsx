import AppText from "@/components/custom/AppText";
import ButtonWithIcon from "@/components/custom/ButtonWithIcon";
import List from "@/components/custom/list/List";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import { EvilIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import React, { FunctionComponent, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

interface PaymentSummaryProps {}

const PaymentSummary: FunctionComponent<PaymentSummaryProps> = () => {
  const [isChecked, setIsChecked] = useState(false);
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
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              alignSelf: "center",
            }}
          >
            <AppText style={styles.hide}>Hide</AppText>
            <MaterialCommunityIcons
              name="chevron-down"
              color={Colors.app.black}
              size={24}
            />
          </View>
        </View>

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
          leftTopLabel="Iphone 11"
          leftBottomLabel="₦ 300,000"
          rightLabel="1X"
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
          leftTopLabel="Iphone 11"
          leftBottomLabel="₦ 300,000"
          rightLabel="1X"
          rightLabelStyle={styles.right}
        />
        <AppText style={styles.title}>Payment Option</AppText>
        <View style={styles.btnContainer}>
          <ButtonWithIcon
            icon={
              <Checkbox
                value={isChecked}
                onValueChange={setIsChecked}
                color={isChecked ? Colors.app.primary : undefined}
                style={[styles.checkbox]}
              />
            }
            titleStyle={styles.titleStyle}
            btnContainerStyle={styles.btn}
            title="Full payment"
          />
          <ButtonWithIcon
            icon={
              <Checkbox
                value={isChecked}
                onValueChange={setIsChecked}
                color={isChecked ? Colors.app.primary : undefined}
                style={[styles.checkbox]}
              />
            }
            titleStyle={styles.titleStyle}
            btnContainerStyle={styles.btn}
            title="Installemnt"
          />
        </View>
        <AppText style={styles.title}>Payment Option</AppText>

        <List
          listStyle={{
            padding: 12,
            backgroundColor: Colors.app.white,
            height: 80,
            width: "100%",
          }}
          leftIcon={
            <Checkbox
              value={isChecked}
              onValueChange={setIsChecked}
              color={isChecked ? Colors.app.primary : undefined}
              style={[styles.checkbox]}
            />
          }
          leftTopLabelStyle={styles.topLabel}
          leftBottomLabelStyle={styles.bottomLabel}
          leftTopLabel="Iphone 11"
          leftBottomLabel="₦ 300,000"
          rightLabel="Free"
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
            <Checkbox
              value={isChecked}
              onValueChange={setIsChecked}
              color={isChecked ? Colors.app.primary : undefined}
              style={[styles.checkbox]}
            />
          }
          leftTopLabelStyle={styles.topLabel}
          leftBottomLabelStyle={styles.bottomLabel}
          leftTopLabel="Iphone 11"
          leftBottomLabel="₦ 300,000"
          rightLabel="₦2000"
          rightLabelStyle={styles.right}
        />
      </View>
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
  btn: {
    backgroundColor: Colors.app.white,
    width: "45%",
    color: Colors.app.white,
    height: 50,
    borderColor: Colors.app.light,
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
});

export default PaymentSummary;
