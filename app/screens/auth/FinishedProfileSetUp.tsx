import React, { FunctionComponent, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SVGComponent from "@/components/custom/SVGComponent";
import SetProfilePicture from "@/components/custom/profileSetup/SetProfilePicture";
import pay from "../../../assets/images/custom/svg/pay.svg";
import loow from "../../../assets/images/custom/svg/loow.svg";
import AppText from "@/components/custom/AppText";
import { useForm } from "@/app/context/FormContext";
import AppButton from "@/components/custom/AppButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import routes from "@/app/navigations/routes";

interface ProfileSetUpProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

type RootStackParamList = {
  SignIn: undefined;
};

const FinishedProfileSetUp: FunctionComponent<ProfileSetUpProps> = ({
  navigation,
}) => {
  const { formValues } = useForm();

  return (
    <Screen backgroundColor={Colors.app.white}>
      <View style={styles.container}>
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

        <Image
          style={styles.profileImage}
          source={
            formValues.image
              ? { uri: formValues.image } // Show the chosen image if available
              : require("../../../assets/images/custom/profile.png") // Default fallback image
          }
        />
        <AppText style={styles.welcomeText}>
          Welcome to payloow, {formValues.firstName} {formValues.lastName}
        </AppText>

        <View style={styles.buttonContainer}>
          <AppButton
            title="Login"
            btnContainerStyle={styles.btn}
            titleStyle={styles.btnTitleStyle}
            onPress={() => navigation.navigate(routes.SIGNIN)}
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
    gap: 40,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginLeft: 5,
  },
  IconContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    marginTop: 50,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.app.black,
    lineHeight: 30,
    width: "70%",
    alignSelf: "center",
    textAlign: "center",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingTop: 250,
    width: "90%",
  },
  btn: {
    backgroundColor: Colors.app.primary,
    width: "100%",
    color: Colors.app.white,
  },
  btnTitleStyle: {
    fontFamily: "DM Sans",
    color: Colors.app.white,
    fontWeight: "400",
    lineHeight: 20,
  },
});

export default FinishedProfileSetUp;
