import { Colors } from "@/constants/Colors";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../AppText";
import SetProductImageModal from "./SetProductImageModal";

interface PartnerScreenModalProps {
  visible: boolean;
  onClose: () => void;
  onPressBtn: (btn: string) => void;
}

const PartnerScreenModal: React.FC<PartnerScreenModalProps> = ({
  visible,
  onClose,
  onPressBtn,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("image");
  return (
    <>
      {!isModalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={onClose}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Buttons */}
              {/* <View style={styles.btnAndText}>
                <AppText style={styles.buttonText}>Lock & Unlock</AppText>
                <TouchableOpacity
                  style={[styles.modalButton]}
                  onPress={onClose}
                >
                  <AntDesign name="lock" size={16} color={Colors.app.primary} />
                </TouchableOpacity>
              </View> */}
              <View style={styles.btnAndText}>
                <AppText style={styles.buttonText}>Add Product</AppText>
                <TouchableOpacity
                  style={[styles.modalButton]}
                  onPress={() => {
                    onClose();
                    onPressBtn("product");
                  }}
                >
                  <AntDesign
                    name="CodeSandbox"
                    size={16}
                    color={Colors.app.primary}
                  />
                </TouchableOpacity>
              </View>
              {/* <View style={styles.btnAndText}>
                <AppText style={styles.buttonText}>Add Image</AppText>
                <TouchableOpacity
                  style={[styles.modalButton]}
                  onPress={() => setModalVisible(true)}
                >
                  <Feather name="users" size={16} color={Colors.app.primary} />
                </TouchableOpacity>
              </View> */}
              <View style={styles.btnAndText}>
                <AppText style={styles.buttonText}>Cancel</AppText>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    {
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: Colors.app.primary,
                    },
                  ]}
                  onPress={onClose}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={18}
                    color={Colors.app.white}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {isModalVisible && modalType === "image" && (
        <SetProductImageModal isVisible={isModalVisible} onClose={() => {}} />
      )}
    </>
  );
};

// Styles
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "90%",
    alignSelf: "center",
    marginBottom: 50,
  },
  modalButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    width: 30,
    height: 30,
    backgroundColor: Colors.app.white,
  },
  btnAndText: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    paddingVertical: 5,
  },
  buttonText: {
    color: Colors.app.white,
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "DM Sans",
    lineHeight: 20,
  },
});

export default PartnerScreenModal;
