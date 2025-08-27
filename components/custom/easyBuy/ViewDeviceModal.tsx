import { Colors } from "@/constants/Colors";
import React, { FunctionComponent } from "react";
import { Modal, StyleSheet, View, TouchableOpacity, Image } from "react-native";
import * as Yup from "yup";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "../AppText";
import AppButton from "../AppButton";

interface ViewDeviceModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const validationSchema = Yup.object().shape({
  pin: Yup.string()
    .required("PIN is required")
    .length(4, "PIN must be exactly 4 digits"),
});

const ViewDeviceModal: FunctionComponent<ViewDeviceModalProps> = ({
  isVisible,
  onClose,
}) => {
  const handleSubmit = async (values: { pin: string }) => {};

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={styles.heading}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <MaterialCommunityIcons
                name="close"
                color={Colors.app.black}
                size={24}
              />
            </TouchableOpacity>
            <AppText style={styles.title}>Detail</AppText>
          </View>

          <View style={styles.contents}>
            <Image
              style={styles.img}
              source={require("../../../assets/images/custom/detail-phone.png")}
            />
            <View style={styles.productDetails}></View>
            <View style={styles.status}></View>
            <View style={styles.pending}></View>
          </View>

          {/* Submit button at the very bottom */}
          <View style={styles.bottomSpacing}>
            <AppButton
              titleStyle={styles.titleStyle}
              btnContainerStyle={styles.btn}
              title="Set Code"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: Colors.app.screen,
    borderRadius: 15,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    height: "90%",
    gap: 30,
  },
  closeBtn: {},
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 90,
    width: "90%",
    height: "10%",
  },
  CODELabel: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontSize: 14,
    fontWeight: "500",
    color: Colors.app.black,
    marginTop: 40,
  },
  contents: {
    width: "80%",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "90%",
    gap: 20,
  },
  btn: {
    backgroundColor: Colors.app.primary,
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
  },
  titleStyle: {
    fontWeight: "bold",
    fontSize: 16,
    color: Colors.app.white,
  },
  bottomSpacing: {
    position: "absolute",
    bottom: 20, // Ensures the button is at the very bottom
    width: "100%",
    alignItems: "center",
  },
  img: {
    width: 96,
    height: 83,
  },
  productDetails: {
    width: "90%",
    height: 86,
    backgroundColor: "red",
  },
  status: {
    width: "90%",
    height: 70,
  },
  pending: {
    width: "90%",
    height: 60,
    backgroundColor: "red",
  },
  title: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontSize: 18,
    fontWeight: "600",
    color: Colors.app.black,
    lineHeight: 20,
  },
});

export default ViewDeviceModal;
