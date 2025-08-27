import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import Done from "@/components/custom/Done";
import { Colors } from "@/constants/Colors";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import BottomShape from "../../../assets/images/custom/svg/Intersect-bottom.svg";
import TopShape from "../../../assets/images/custom/svg/Intersect-top.svg";

const WelcomeScreen: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.7}>
            <AppText style={styles.skip}>Skip for now</AppText>
          </TouchableOpacity>
        </View>
        <View style={styles.illustrationWrapper}>
          <Done />
        </View>
        <View style={styles.heading}> 
          <AppText style={styles.title}>Complete your profile</AppText>
          <AppText style={styles.subTitle}>
            Take a moment to finish setting up and unlock all benefits without re-entering details later.
          </AppText>
        </View>
        <View style={styles.actions}>
          <AppButton
            titleStyle={styles.btnTitleStyle}
            btnContainerStyle={styles.btn}
            title="Set profile now"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 40,
    alignItems: 'center',
    backgroundColor: Colors.app.white,
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
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 40,
  },
  header: {
    width: '90%',
    alignItems: 'flex-end',
  },
  skip: {
    color: Colors.app.primary,
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  illustrationWrapper: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    width: '90%',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontFamily: 'DM Sans',
    fontSize: 28,
    fontWeight: '700',
    color: Colors.app.black,
    textAlign: 'center',
    lineHeight: 34,
  },
  subTitle: {
    fontSize: 14,
    color: Colors.app.dark,
    fontFamily: 'DM Sans',
    fontWeight: '400',
    lineHeight: 20,
    textAlign: 'center',
    width: '85%',
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

export default WelcomeScreen;
