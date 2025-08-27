import AppText from "@/components/custom/AppText";
import MenuBg from "@/components/custom/easyBuy/MenuBg";
import Balance from "@/components/custom/profile/Balance";
import Screen from "@/components/custom/Screen";
import SVGComponent from "@/components/custom/SVGComponent";
import ServiceContainer from "@/components/custom/utility/ServiceContainer";
import { Colors } from "@/constants/Colors";
import React, { FunctionComponent, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import iphone from "../../../../assets/images/custom/svg/list-iphone.svg";
import List from "@/components/custom/list/List";
import ViewDeviceModal from "@/components/custom/easyBuy/ViewDeviceModal";

interface InstallmentMainScreenProps {}

const InstallmentMainScreen: FunctionComponent<
  InstallmentMainScreenProps
> = () => {
  const [detailsVisibile, setDetailsVisible] = useState(false);

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <View style={styles.container}>
        <View style={styles.head}>
          <Balance />
          <View style={styles.serviceContainer}>
            <ServiceContainer
              style={{ width: "45%", gap: 10 }}
              iconColor={Colors.app.primary}
              icon="arrow-up"
              label="Top Up"
            />
            <ServiceContainer
              style={{ width: "45%", gap: 10 }}
              iconColor={Colors.app.primary}
              icon="arrow-up"
              label="Top Up"
            />
          </View>
        </View>
        <AppText style={styles.overview}>Overview</AppText>
        <View style={styles.menuBg}>
          <MenuBg />
          <MenuBg />
        </View>

        <View style={styles.menuBg}>
          <MenuBg />
          <MenuBg />
        </View>

        <View style={styles.purchases}>
          <View style={styles.purchasesTitleContainer}>
            <AppText style={styles.purchasesTitle}>
              Installment Purchases
            </AppText>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 5,
              }}
            >
              <AppText style={styles.viewAll}>View all</AppText>
            </TouchableOpacity>
          </View>
          {/* <View style={styles.emptyList}>
            <SVGComponent
              width={100}
              height={100}
              style={{ marginHorizontal: 5 }}
              SvgFile={box}
            />
            <AppText style={styles.emptyLabel}>
              No any Installment item yet.
            </AppText>
          </View> */}
          <View style={styles.purchasesList}>
            <List
              leftIcon={
                <SVGComponent
                  width={30}
                  height={30}
                  style={{ marginHorizontal: 5 }}
                  SvgFile={iphone}
                />
              }
              leftLabel="Transaction history"
              rightIcon={<AppText style={styles.status}>Active</AppText>}
              onPress={() => setDetailsVisible(true)}
            />
            <List
              leftIcon={
                <SVGComponent
                  width={30}
                  height={30}
                  style={{ marginHorizontal: 5 }}
                  SvgFile={iphone}
                />
              }
              leftLabel="Transaction history"
              rightIcon={<AppText style={styles.status}>Active</AppText>}
              onPress={() => setDetailsVisible(true)}
            />
            <List
              leftIcon={
                <SVGComponent
                  width={30}
                  height={30}
                  style={{ marginHorizontal: 5 }}
                  SvgFile={iphone}
                />
              }
              leftLabel="Transaction history"
              rightIcon={<AppText style={styles.status}>Active</AppText>}
              onPress={() => setDetailsVisible(true)}
            />
          </View>
        </View>
      </View>
      {detailsVisibile && (
        <ViewDeviceModal
          onClose={() => setDetailsVisible(false)}
          isVisible={detailsVisibile}
        />
      )}
    </Screen>
  );
};
const styles = StyleSheet.create({
  serviceContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    alignSelf: "center",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    alignSelf: "center",
    marginTop: 20,
    gap: 10,
  },
  menuBg: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
    gap: 16,
  },
  head: {
    width: "90%",
  },
  overview: {
    color: Colors.app.black,
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "DM Sans",
    lineHeight: 24,
    alignSelf: "flex-start",
    width: "100%",
  },
  viewAll: {
    color: Colors.app.primary,
    fontSize: 14,
    fontWeight: "400",
    fontStyle: "normal",
    lineHeight: 20,
  },
  purchasesTitle: {
    color: Colors.app.black,
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "DM Sans",
    lineHeight: 24,
    alignSelf: "flex-start",
    padding: 6,
  },
  purchasesTitleContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    alignSelf: "flex-start",
    height: "15%",
  },
  purchases: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: 264,
    backgroundColor: Colors.app.white,
    padding: 10,
  },
  emptyList: {
    width: "100%",
    height: "85%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 20,
    alignSelf: "center",
    backgroundColor: "red",
  },
  emptyLabel: {
    color: Colors.app.dark,
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "DM Sans",
    lineHeight: 16,
  },
  status: {
    width: 89,
    height: 25,
    backgroundColor: Colors.app.active,
    color: Colors.app.success,
    textAlign: "center",
  },
  purchasesList: {
    width: "100%",
    height: "85%",
    gap: 20,
    alignSelf: "center",
    borderRadius: 10,
  },
});

export default InstallmentMainScreen;
