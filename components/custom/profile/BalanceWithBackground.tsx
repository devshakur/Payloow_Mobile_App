import React, { FunctionComponent } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import SVGComponent from "../SVGComponent";
import topSVG from "../../../assets/images/custom/svg/Intersect-top.svg";
import bottomSVG from "../../../assets/images/custom/svg/Intersect-bottom.svg";
import Balance from "./Balance";
import AppText from "../AppText";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface BalanceWithBackgroundProps {}
const BalanceWithBackground: FunctionComponent<
  BalanceWithBackgroundProps
> = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.bgImg}
        imageStyle={styles.imageStyle} // Apply border radius here
        source={require("../../../assets/images/custom/balance-bg.png")}
      >
        <SVGComponent
          width={64}
          height={64}
          style={{
            marginHorizontal: 5,
            position: "absolute",
            top: 12,
            left: 6,
          }}
          SvgFile={topSVG}
        />
        <SVGComponent
          width={64}
          height={64}
          style={{
            marginHorizontal: 5,
            position: "absolute",
            bottom: 12,
            right: 6,
          }}
          SvgFile={bottomSVG}
        />

        <Balance
          balanceAmount={{ color: Colors.app.white }}
          label={{ color: Colors.app.white }}
        />

        <View style={styles.account}>
          <AppText style={styles.accountNumber}>
            Paying No: +234 7083 175021
          </AppText>
          <Feather name="copy" size={12} color={Colors.app.white} />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10, // Ensure parent View has borderRadius
    overflow: "hidden", // Ensures child elements respect the border radius
    width: "100%",
  },
  bgImg: {
    height: 138,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  imageStyle: {
    borderRadius: 10, // Apply borderRadius to the ImageBackground image
  },
  accountNumber: {
    color: Colors.app.white,
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "DM Sans",
    lineHeight: 20,
  },
  account: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "flex-start",
    padding: 10,
    gap: 8,
  },
});

export default BalanceWithBackground;
