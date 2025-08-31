import AppText from "@/components/custom/AppText";
import ButtonWithIcon from "@/components/custom/ButtonWithIcon";
import Cancel from "@/components/custom/Failed";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import { SimpleLineIcons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import { FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";

type ErrorScreenRouteParams = {
  responseText?: string;
};

const ErrorScreen: FunctionComponent = () => {
  const route =
    useRoute<RouteProp<Record<string, ErrorScreenRouteParams>, string>>();
  const responseText =
    route.params?.responseText || "An unexpected error occurred.";

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <View style={styles.content}>
            <Cancel />
            <View style={styles.textContainer}>
              <AppText style={styles.title}>Failed</AppText>
              <AppText style={styles.subTitle}>{responseText}</AppText>
            </View>
          </View>
          <View style={styles.btnContainer}>
            <ButtonWithIcon
              icon={
                <SimpleLineIcons name="earphones-alt" size={24} color="black" />
              }
              titleStyle={styles.titleStyle}
              btnContainerStyle={styles.btn}
              title="Contact support"
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
    fontFamily: "DMSans-Bold",
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
    fontFamily: "DMSans-Regular",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    fontStyle: "normal",
    width: 310,
  },
  titleStyle: {
    fontSize: 12,
    color: Colors.app.black,
    fontFamily: "DMSans-Medium",
    fontStyle: "normal",
    lineHeight: 18,
  },
  btnContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
  },
});

export default ErrorScreen;
