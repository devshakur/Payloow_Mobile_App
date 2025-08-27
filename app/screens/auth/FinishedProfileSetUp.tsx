import { useForm } from "@/app/context/FormContext";
import routes from "@/app/navigations/routes";
import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import SVGComponent from "@/components/custom/SVGComponent";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { FunctionComponent } from "react";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import BottomShape from "../../../assets/images/custom/svg/Intersect-bottom.svg";
import TopShape from "../../../assets/images/custom/svg/Intersect-top.svg";
import loow from "../../../assets/images/custom/svg/loow.svg";
import pay from "../../../assets/images/custom/svg/pay.svg";

interface ProfileSetUpProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

type RootStackParamList = {
  SignIn: undefined;
};

const FinishedProfileSetUp: FunctionComponent<ProfileSetUpProps> = ({ navigation }) => {
  const { formValues } = useForm();
  const displayName = `${formValues.firstName || ''} ${formValues.lastName || ''}`.trim();

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Decorative background graphics */}
      <View style={styles.backgroundGraphics} pointerEvents="none">
        <View style={styles.topShapeWrapper}>
          <View style={styles.topShapeBox}>
            <TopShape />
          </View>
        </View>
        <View style={styles.bottomShapeWrapper}>
          <View style={styles.bottomShapeBox}>
            <BottomShape />
          </View>
        </View>
        <View style={styles.circleLarge} />
        <View style={styles.circleSmall} />
        <View style={styles.squareLarge} />
        <View style={styles.squareSmall} />
      </View>

      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.app.dark} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.IconContainer}>
          <SVGComponent width={41} height={51} style={{ marginHorizontal: 5 }} SvgFile={pay} />
          <SVGComponent width={114} height={51} SvgFile={loow} style={{ marginHorizontal: 35 }} />
        </View>
        <View style={styles.heading}> 
          <AppText style={styles.title}>Profile Complete</AppText>
          <AppText style={styles.subTitle}>You&apos;re all set — welcome aboard!</AppText>
        </View>
        <Image
          style={styles.profileImage}
          source={
            formValues.image
              ? { uri: formValues.image }
              : require("../../../assets/images/custom/profile.png")
          }
        />
        <AppText style={styles.welcomeText}>Welcome to payloow{displayName ? `, ${displayName}` : ''}</AppText>
        <AppText style={styles.helperText}>Start exploring services, manage finances, learn & invest seamlessly.</AppText>
        <View style={styles.actions}>
          <AppButton
            title="Go to Login"
            btnContainerStyle={styles.btn}
            titleStyle={styles.btnTitleStyle}
            onPress={() => navigation.navigate(routes.SIGNIN)}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 32,
    backgroundColor: Colors.app.white,
    alignItems: 'center'
  },
  backgroundGraphics: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topShapeWrapper: {
    position: 'absolute',
    top: 0,
    right: -80,
    opacity: 0.18,
  },
  bottomShapeWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 300,
    opacity: 0.15,
  },
  topShapeBox: {
    width: 240,
    height: 240,
    transform: [{ rotate: '12deg' }],
  },
  bottomShapeBox: {
    width: 260,
    height: 260,
    transform: [{ rotate: '-8deg' }],
  },
  circleLarge: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#DDEEFF',
    top: -60,
    left: -80,
    opacity: 0.36,
  },
  circleSmall: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#CFE6FF',
    top: 40,
    right: 8,
    opacity: 0.32,
  },
  squareLarge: {
    position: 'absolute',
    width: 220,
    height: 220,
    backgroundColor: '#CFEFFF',
    left: -8,
    bottom: -10,
    opacity: 0.48,
    transform: [{ rotate: '12deg' }],
    borderRadius: 16,
  },
  squareSmall: {
    position: 'absolute',
    width: 96,
    height: 96,
    backgroundColor: '#9FD8FF',
    right: -6,
    bottom: 20,
    opacity: 0.44,
    transform: [{ rotate: '22deg' }],
    borderRadius: 12,
  },
  headerBar: {
    width: '100%',
    paddingHorizontal: 8,
    paddingTop: 0,
    paddingBottom: 0,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    opacity: 0.6,
  },
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 24,
  },
  IconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 0,
  },
  heading: {
    width: '90%',
    alignItems: 'flex-start',
    gap: 4,
  },
  title: {
    fontFamily: 'DM Sans',
    fontSize: 28,
    fontWeight: '700',
    color: Colors.app.black,
  },
  subTitle: {
    fontSize: 14,
    color: Colors.app.dark,
    fontFamily: 'DM Sans',
    fontWeight: '400',
    lineHeight: 20,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.app.black,
    lineHeight: 30,
    width: '80%',
    textAlign: 'center',
  },
  helperText: {
    fontSize: 14,
    color: Colors.app.dark,
    fontFamily: 'DM Sans',
    fontWeight: '400',
    lineHeight: 20,
    width: '80%',
    textAlign: 'center'
  },
  actions: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  btn: {
    backgroundColor: Colors.app.primary,
    width: '90%',
  },
  btnTitleStyle: {
    fontFamily: 'DM Sans',
    color: Colors.app.white,
    fontWeight: '400',
    lineHeight: 20,
  },
});

export default FinishedProfileSetUp;
