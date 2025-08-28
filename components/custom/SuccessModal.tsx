import { Colors } from "@/constants/Colors";
import { FunctionComponent } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppText from "./AppText";
import RoundIcon from "./RoundIcon";

interface SuccessModalProps {
  onClose?: () => void;
  visible?: boolean;
  responseText: string;
  onBack?: () => void; // optional custom back handler
}

const SuccessModal: FunctionComponent<SuccessModalProps> = ({
  onClose,
  visible,
  responseText,
  onBack,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Close Icon */}
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <RoundIcon
              name="close"
              iconType="ant-design"
              backgroundColor={Colors.app.light}
              iconColor={Colors.app.white}
              size={30}
              onPress={onClose}
            />
          </TouchableOpacity>

          {/* SVG Placeholder */}
          <View>
            <RoundIcon
              name="check"
              iconType="ant-design"
              backgroundColor={Colors.app.success}
              iconColor={Colors.app.white}
              size={70}
            />
          </View>

          {/* Success Text */}
          <AppText style={styles.successText}>Success</AppText>
          <Text style={styles.responseText}>
            {responseText || "Your response here"}
          </Text>

          {/* Back Button */}
          <TouchableOpacity style={styles.button} onPress={onBack || onClose}>
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
    backgroundColor: Colors.app.success,
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
  successText: {
    color: Colors.app.primary,
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 10,
  },
});

export default SuccessModal;
