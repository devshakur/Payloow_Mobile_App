import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import ButtonWithIcon from "@/components/custom/ButtonWithIcon";
import Done from "@/components/custom/Done";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import React, { FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";

interface SuccessScreenProps {}

const SuccessScreen: FunctionComponent<SuccessScreenProps> = () => {
  return (
    <Screen backgroundColor={Colors.app.screen}>
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <View style={styles.content}>
            <Done />
            <View style={styles.textContainer}>
              <AppText style={styles.title}>Successful</AppText>
              <AppText style={styles.subTitle}>
                Airtime of ₦1000.00 for 07083175021 was purchased.
              </AppText>
            </View>
          </View>
          <View style={styles.btnContainer}>
            <ButtonWithIcon
              icon={
                <AntDesign
                  name="sharealt"
                  size={24}
                  color={Colors.app.primary}
                />
              }
              titleStyle={styles.titleStyle}
              btnContainerStyle={styles.btn}
              title="Set Profile Now"
            />
            <ButtonWithIcon
              icon={<FontAwesome6 name="receipt" size={24} color="#D257E5" />}
              titleStyle={styles.titleStyle}
              btnContainerStyle={styles.btn}
              title="Set Profile Now"
            />
          </View>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.app.white,
    width: "50%",
    color: Colors.app.white,
    height: 42,
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
    marginTop: 50,
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
    fontSize: 12,
    color: Colors.app.black,
    fontWeight: "500",
    fontStyle: "normal",
    fontFamily: "DM Sans",
    lineHeight: 18,
  },
  btnContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
  },
});

export default SuccessScreen;
