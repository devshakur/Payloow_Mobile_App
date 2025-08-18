import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { FunctionComponent } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import AppButton from "../AppButton";
import ImageBox from "../ImageBox";

interface SetProductImageModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const SetProductImageModal: FunctionComponent<SetProductImageModalProps> = ({
  isVisible,
  onClose,
}) => {

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={styles.nutch} />
          {/* Close button at the top-left */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <MaterialCommunityIcons
              name="close"
              color={Colors.app.black}
              size={24}
            />
            <View style={styles.contents}>
              <ImageBox onSelectedImage={() => {}} />
              <ImageBox onSelectedImage={() => {}} />
              <ImageBox onSelectedImage={() => {}} />
              <ImageBox onSelectedImage={() => {}} />
              <AppButton
                title="Next"
                titleStyle={styles.titleStyle}
                btnContainerStyle={styles.btn}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: Colors.app.screen,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 10,
    marginTop: 50,
    height: "95%",
    padding: 20,
  },
  closeBtn: {
    position: "absolute",
    left: 10,
    zIndex: 10,
    top: 10,
  },
  nutch: {
    width: 120,
    height: 5,
    backgroundColor: Colors.app.black,
    borderRadius: 3,
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
  contents: {
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginVertical: 30,
  },
});

export default SetProductImageModal;
