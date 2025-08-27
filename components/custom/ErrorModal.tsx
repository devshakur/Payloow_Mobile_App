import { Colors } from "@/constants/Colors";
import React, { FunctionComponent } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppText from "./AppText";
import RoundIcon from "./RoundIcon";

interface ErrorModalProps {
  visible?: boolean;
  onClose?: () => void;
  responseText: string;
}

const ErrorModal: FunctionComponent<ErrorModalProps> = ({
  visible,
  onClose,
  responseText,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Close Icon */}
          <View style={styles.closeIcon}>
            <RoundIcon
              name="close"
              iconType="ant-design"
              backgroundColor={Colors.app.light}
              iconColor={Colors.app.white}
              size={30}
              onPress={onClose}
            />
          </View>

          {/* SVG Placeholder */}
          <View>
            <RoundIcon
              name="close"
              iconType="ant-design"
              backgroundColor={Colors.app.failed}
              iconColor={Colors.app.white}
              size={70}
            />
          </View>

          {/* Success Text */}
          <AppText style={styles.errorText}>Error</AppText>
          <Text style={styles.responseText}>
            {responseText || "Your response here"}
          </Text>

          {/* Back Button */}
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: Colors.app.screen,
    borderRadius: 10,
    alignItems: "center",
  },
  responseText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: Colors.app.light,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.app.failed,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  closeIcon: {
    alignSelf: "flex-end",
  },
  errorText: {
    color: Colors.app.primary,
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 10,
  },
});
export default ErrorModal;
