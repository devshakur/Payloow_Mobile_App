import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import Done from "@/components/custom/Done";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import React, { FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";

interface WelcomeScreenProps {}

const WelcomeScreen: FunctionComponent<WelcomeScreenProps> = () => {
  return (
    <Screen backgroundColor={Colors.app.white}>
      <View style={styles.container}>
        <View style={styles.header}>
          <AppText style={styles.skip}>Skip for Now</AppText>
        </View>
        <View style={styles.contentWrapper}>
          <View style={styles.content}>
            <Done />
            <View style={styles.textContainer}>
              <AppText style={styles.title}>
                We’re excited to have you on board 🥳
              </AppText>
              <AppText style={styles.subTitle}>
                Take a moment to complete your profile now and unlock all the
                benefits we’ve prepared for you without having to re-enter your
                details.
              </AppText>
            </View>
          </View>
          <AppButton
            titleStyle={styles.titleStyle}
            btnContainerStyle={styles.btn}
            title="Set Profile Now"
          />
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.app.primary,
    width: "100%",
    color: Colors.app.white,
  },
  contentWrapper: {
    width: "90%",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 72,
  },
  content: {
    width: "90%",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  textContainer: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  title: {
    textAlign: "center",
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontSize: 20,
    lineHeight: 30,
    fontWeight: "700",
    fontStyle: "normal",
    width: "80%",
  },
  container: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    gap: 54,
  },
  header: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "90%",
  },
  skip: {
    color: Colors.app.primary,
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "400",
    fontStyle: "normal",
    lineHeight: 20,
  },
  subTitle: {
    textAlign: "center",
    color: Colors.app.dark,
    fontFamily: "DM Sans",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    fontStyle: "normal",
    width: 310,
  },
  titleStyle: {
    fontWeight: "normal",
    fontSize: 16,
    color: Colors.app.white,
  },
});

export default WelcomeScreen;
