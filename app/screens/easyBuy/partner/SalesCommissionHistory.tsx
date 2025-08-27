import AppText from "@/components/custom/AppText";
import List from "@/components/custom/list/List";
import Screen from "@/components/custom/Screen";
import SVGComponent from "@/components/custom/SVGComponent";
import { Colors } from "@/constants/Colors";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";
import done from "../../../../assets/images/custom/svg/Done_round_fill.svg";

interface SalesCommissionHistoryProps {}

const SalesCommissionHistory: FunctionComponent<
  SalesCommissionHistoryProps
> = () => {
  return (
    <Screen backgroundColor={Colors.app.screen}>
      <View style={styles.container}>
        <View style={styles.heading}>
          <MaterialCommunityIcons
            name="arrow-left"
            color={Colors.app.black}
            size={20}
          />
          <AppText style={styles.middleTitle}>Sales & Commission</AppText>

          <Feather name="menu" size={24} color="black" />
        </View>
        <View style={styles.salesCommission}>
          <List
            listStyle={{ padding: 10 }}
            leftIcon={
              <View style={styles.iconContainer}>
                <SVGComponent
                  width={24}
                  height={24}
                  style={{ borderRadius: "100%" }}
                  SvgFile={done}
                />
              </View>
            }
            leftTopLabel="Techno Spark 7 Plus"
            leftBottomLabel="22nd Dec, 2024"
            rightLabel="₦1500"
            rightLabelStyle={styles.rightLableStyle}
            leftBottomLabelStyle={styles.leftBottomLabel}
            leftTopLabelStyle={styles.leftTopLabel}
          />
          <List
            listStyle={{ padding: 10 }}
            leftIcon={
              <View style={styles.iconContainer}>
                <SVGComponent
                  width={24}
                  height={24}
                  style={{ borderRadius: "100%" }}
                  SvgFile={done}
                />
              </View>
            }
            leftTopLabel="Techno Spark 7 Plus"
            leftBottomLabel="22nd Dec, 2024"
            rightLabel="₦1500"
            rightLabelStyle={styles.rightLableStyle}
            leftBottomLabelStyle={styles.leftBottomLabel}
            leftTopLabelStyle={styles.leftTopLabel}
          />
          <List
            listStyle={{ padding: 10 }}
            leftIcon={
              <View style={styles.iconContainer}>
                <SVGComponent
                  width={24}
                  height={24}
                  style={{ borderRadius: "100%" }}
                  SvgFile={done}
                />
              </View>
            }
            leftTopLabel="Techno Spark 7 Plus"
            leftBottomLabel="22nd Dec, 2024"
            rightLabel="₦1500"
            rightLabelStyle={styles.rightLableStyle}
            leftBottomLabelStyle={styles.leftBottomLabel}
            leftTopLabelStyle={styles.leftTopLabel}
          />
          <List
            listStyle={{ padding: 10 }}
            leftIcon={
              <View style={styles.iconContainer}>
                <SVGComponent
                  width={24}
                  height={24}
                  style={{ borderRadius: "100%" }}
                  SvgFile={done}
                />
              </View>
            }
            leftTopLabel="Techno Spark 7 Plus"
            leftBottomLabel="22nd Dec, 2024"
            rightLabel="₦1500"
            rightLabelStyle={styles.rightLableStyle}
            leftBottomLabelStyle={styles.leftBottomLabel}
            leftTopLabelStyle={styles.leftTopLabel}
          />
          <List
            listStyle={{ padding: 10 }}
            leftIcon={
              <View style={styles.iconContainer}>
                <SVGComponent
                  width={24}
                  height={24}
                  style={{ borderRadius: "100%" }}
                  SvgFile={done}
                />
              </View>
            }
            leftTopLabel="Techno Spark 7 Plus"
            leftBottomLabel="22nd Dec, 2024"
            rightLabel="₦1500"
            rightLabelStyle={styles.rightLableStyle}
            leftBottomLabelStyle={styles.leftBottomLabel}
            leftTopLabelStyle={styles.leftTopLabel}
          />
          <List
            listStyle={{ padding: 10 }}
            leftIcon={
              <View style={styles.iconContainer}>
                <SVGComponent
                  width={24}
                  height={24}
                  style={{ borderRadius: "100%" }}
                  SvgFile={done}
                />
              </View>
            }
            leftTopLabel="Techno Spark 7 Plus"
            leftBottomLabel="22nd Dec, 2024"
            rightLabel="₦1500"
            rightLabelStyle={styles.rightLableStyle}
            leftBottomLabelStyle={styles.leftBottomLabel}
            leftTopLabelStyle={styles.leftTopLabel}
          />
        </View>
      </View>
    </Screen>
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
  heading: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
    height: "10%",
  },
  history: {
    color: Colors.app.primary,
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "400",
    fontStyle: "normal",
    lineHeight: 20,
    textAlign: "center",
  },
  middleTitle: {
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 28,
    textAlign: "center",
  },
  salesCommission: {
    width: "90%",
    backgroundColor: Colors.app.white,
    borderRadius: 5,
  },

  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.app.checkBg,
    flexDirection: "column",
    width: 40,
    height: 40,
    borderRadius: 20, // Instead of "100%" use 20 to ensure it's a circle
  },
  leftTopLabel: {
    color: Colors.app.dark,
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 20,
  },
  leftBottomLabel: {
    color: Colors.app.dark,
    fontFamily: "DM Sans",
    fontSize: 12,
    fontWeight: "400",
    fontStyle: "normal",
    lineHeight: 18,
  },
  rightLableStyle: {
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "700",
    fontStyle: "normal",
    lineHeight: 20,
  },
});

export default SalesCommissionHistory;
