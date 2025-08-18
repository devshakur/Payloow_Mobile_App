import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../AppText";

interface TutorLessonModalProps {
  visible: boolean;
  onClose: () => void;
  onPressBtn: (btn: string) => void;
}

const TutorLessonModal: React.FC<TutorLessonModalProps> = ({
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
              <View style={styles.btnAndText}>
                <AppText style={styles.buttonText}>Add Quiz</AppText>
                <TouchableOpacity
                  style={[styles.modalButton]}
                  onPress={() => {
                    onClose();
                    onPressBtn("add-quiz");
                  }}
                >
                  <MaterialCommunityIcons
                    name="book-education"
                    size={16}
                    color={Colors.app.primary}
                  />
                </TouchableOpacity>
              </View>

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

export default TutorLessonModal;
