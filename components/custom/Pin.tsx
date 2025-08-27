import { useUser } from "@/app/context/UserProvider";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { FunctionComponent, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";
import AppText from "./AppText";
import ErrorModal from "./ErrorModal";
import AppForm from "./forms/AppForm";
import AppFormOtpInput from "./forms/AppFormOtpInput";
import SubmitButton from "./forms/SubmitButton";

interface PinProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmitPin: (pin: string) => void; // <-- New
}

const validationSchema = Yup.object().shape({
  pin: Yup.string()
    .required("PIN is required")
    .length(4, "PIN must be exactly 4 digits"),
});

const Pin: FunctionComponent<PinProps> = ({
  isVisible,
  onClose,
  onSubmitPin,
}) => {
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const { user } = useUser();

  const handleSubmit = async ({ pin }: { pin: string }) => {
    onSubmitPin(pin); // <-- Pass pin to parent
    onClose(); // <-- Close the modal
  };

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
          </TouchableOpacity>

          <AppText style={styles.CODELabel}>Set your transfer Code</AppText>

          {/* Form with marginTop */}
          <AppForm
            initialValues={{ pin: "" }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <View style={styles.formContainer}>
              <AppFormOtpInput name="pin" numberOfDigits={4} />
            </View>

            {/* Submit button at the very bottom */}
            <View style={styles.bottomSpacing}>
              <SubmitButton
                titleStyle={styles.titleStyle}
                btnContainerStyle={styles.btn}
                title="Submit Pin"
              />
            </View>
          </AppForm>
        </View>
      </View>
      <ErrorModal
        visible={isError}
        onClose={() => setIsError(false)}
        responseText={responseMessage || "Failed to buy data"}
      />
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
    width: "95%",
    backgroundColor: Colors.app.screen,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    marginTop: 10,
  },
  closeBtn: {
    position: "absolute",
    left: 10,
    top: 20,
    zIndex: 10,
    padding: 10,
  },
  nutch: {
    width: 120,
    height: 5,
    backgroundColor: Colors.app.black,
    borderRadius: 3,
  },
  CODELabel: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontSize: 14,
    fontWeight: "500",
    color: Colors.app.black,
    marginTop: 40,
  },
  formContainer: {
    width: "80%",
    alignItems: "center",
    height: 300,
    marginTop: 20,
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
});

export default Pin;
