import React, { FunctionComponent } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";
import SVGComponent from "./SVGComponent";
import pay from "../../assets/images/custom/svg/pay.svg";
import loow from "../../assets/images/custom/svg/loow.svg";
import Screen from "./Screen";
import { Colors } from "@/constants/Colors";

interface SplashProps {}

const Splash: FunctionComponent<SplashProps> = () => {
  return (
    <Screen backgroundColor={Colors.app.white}>
      <View style={styles.container}>
        <View></View>
        <View style={styles.IconContainer}>
          <SVGComponent
            width={41}
            height={51}
            style={{ marginHorizontal: 5 }}
            SvgFile={pay}
          />
          <SVGComponent
            width={114}
            height={51}
            SvgFile={loow}
            style={{ marginHorizontal: 35 }}
          />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.app.primary} />
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  IconContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    marginBottom: 100,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignContent: "center",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Splash;
