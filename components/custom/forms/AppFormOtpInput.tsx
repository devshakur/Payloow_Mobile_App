import { Colors } from "@/constants/Colors";
import { useFormikContext } from "formik";
import { FunctionComponent, useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import { OtpInput } from "react-native-otp-entry";

interface AppFormOtpInputProps {
  name: string;
  numberOfDigits?: number;
}

const AppFormOtpInput: FunctionComponent<AppFormOtpInputProps> = ({
  name,
  numberOfDigits,
}) => {
  const { setFieldValue, errors, touched, setFieldTouched, submitForm } =
    useFormikContext<any>();
  const otpRef = useRef<any>(null);

  const hasError = Boolean(errors?.[name]) && Boolean(touched?.[name]);

 
  useEffect(() => {
    const timer = setTimeout(() => {
      if (otpRef.current) {
        otpRef.current.focus();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <OtpInput
      ref={otpRef}
      numberOfDigits={numberOfDigits}
      focusColor={Colors.app.primary}
      autoFocus={false} // Disable built-in autoFocus, use our custom one
      hideStick={false}
      blurOnFilled={true}
      disabled={false}
      type="numeric"
      secureTextEntry={true}
      focusStickBlinkingDuration={500}
      onTextChange={(value) => {
        if (value.length === numberOfDigits) {
          setFieldTouched(name, true);
          // Auto-submit when PIN is complete
          setTimeout(() => {
            submitForm();
          }, 100); 
        }

        setFieldValue(name, value);
      }}
      theme={{
        containerStyle: styles.container,
        pinCodeContainerStyle: {
          ...styles.pinCodeContainer,
          borderColor: hasError ? Colors.app.failed : Colors.app.light,
        },
        pinCodeTextStyle: styles.pinCodeText,
        focusStickStyle: styles.focusStick,
        focusedPinCodeContainerStyle: styles.activePinCodeContainer,
        placeholderTextStyle: styles.placeholderText,
        filledPinCodeContainerStyle: styles.filledPinCodeContainer,
        disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
  pinCodeContainer: {
    width: 49,
    height: 49,
    backgroundColor: Colors.app.white,
    borderRadius: 20,
  },
  pinCodeText: {
    color: Colors.app.black,
    fontSize: 18,
  },
  focusStick: {
    backgroundColor: Colors.app.primary,
  },
  activePinCodeContainer: {
    backgroundColor: Colors.app.white,
  },
  placeholderText: {},
  filledPinCodeContainer: {
    backgroundColor: Colors.app.white,
  },
  disabledPinCodeContainer: {},
});

export default AppFormOtpInput;
