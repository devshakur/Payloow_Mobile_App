import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFormikContext } from "formik";
import React, { FunctionComponent, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import AppButton from "./AppButton";
import AppText from "./AppText";
import AppForm from "./forms/AppForm";
import AppFormOtpInput from "./forms/AppFormOtpInput";

interface PinProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmitPin: (pin: string) => void;
  errorMessage?: string | null;
}

const validationSchema = Yup.object().shape({
  pin: Yup.string()
    .required("PIN is required")
    .length(4, "PIN must be exactly 4 digits"),
});

// Inner component to access Formik context
const PinFormContent: FunctionComponent<{
  onPinComplete: (isComplete: boolean) => void;
}> = ({ onPinComplete }) => {
  const { values } = useFormikContext<{ pin: string }>();

  // Check if PIN is complete whenever it changes
  React.useEffect(() => {
    const isComplete = values.pin && values.pin.length === 4;
    onPinComplete(Boolean(isComplete));
  }, [values.pin, onPinComplete]);

  return (
    <View style={styles.formContainer}>
      <AppFormOtpInput name="pin" numberOfDigits={4} />
    </View>
  );
};

const Pin: FunctionComponent<PinProps> = ({
  isVisible,
  onClose,
  onSubmitPin,
  errorMessage,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false); // For future loading state implementation
  const [isPinComplete, setIsPinComplete] = useState(false);
  const [retryTrigger, setRetryTrigger] = useState(0); // Used to trigger form reset

  const handleSubmit = async ({ pin }: { pin: string }) => {
    setIsSubmitting(true);
    try {
      await onSubmitPin(pin);
      // Don't close modal here - let parent component decide based on result
    } catch {
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear PIN input when error occurs
  React.useEffect(() => {
    if (errorMessage) {
      setRetryTrigger(prev => prev + 1); // This will reset the form
    }
  }, [errorMessage]);

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modalContainer}>
            <View style={styles.nutch} />

            {/* Close button top-right */}
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <MaterialCommunityIcons
                name="close"
                color={Colors.app.black}
                size={24}
              />
            </TouchableOpacity>

            <AppText style={styles.CODELabel}>Set your Transfer Code</AppText>

            {errorMessage && (
              <View style={styles.errorContainer}>
                <MaterialCommunityIcons
                  name="alert-circle"
                  color={Colors.app.failed}
                  size={20}
                />
                <AppText style={styles.errorText}>{errorMessage}</AppText>
              </View>
            )}

            <AppForm
              key={retryTrigger}
              initialValues={{ pin: "" }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <PinFormContent onPinComplete={setIsPinComplete} />

              {/* Manual submit button as fallback */}
              <View style={styles.bottomSpacing}>
                <AppButton
                  btnContainerStyle={[
                    styles.btn,
                    (!isPinComplete || isSubmitting) && { backgroundColor: Colors.app.disabled }
                  ]}
                  title={isSubmitting ? "Processing..." : "Continue"}
                  titleStyle={styles.titleStyle}
                  disabled={!isPinComplete || isSubmitting}
                  onPress={() => {
                    // Button press will be handled by Formik's built-in submission
                    // This serves as a visual fallback for users
                  }}
                />
              </View>
            </AppForm>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  keyboardAvoidingView: {
    width: "100%",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: Colors.app.screen,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: "45%",
  },
  closeBtn: {
    position: "absolute",
    right: 10,
    top: 20,
    zIndex: 10,
    padding: 10,
  },
  nutch: {
    width: 60,
    height: 5,
    backgroundColor: Colors.app.gray,
    borderRadius: 3,
    marginBottom: 15,
  },
  CODELabel: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontSize: 16,
    fontWeight: "500",
    color: Colors.app.black,
    marginBottom: 20,
  },
  formContainer: {
    width: "80%",
    alignItems: "center",
    marginTop: 10,
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
    marginTop: "auto", // pushes button to bottom
    width: "100%",
    alignItems: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.app.lock, // light red background
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    width: "100%",
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: Colors.app.failed,
    marginLeft: 8,
    fontFamily: "DM Sans",
  },
});

export default Pin;
