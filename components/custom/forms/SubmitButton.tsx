import React from "react";
import { useFormikContext } from "formik";
import {
  StyleSheet,
  Dimensions,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";

import AppButton from "../AppButton"; // Ensure this component supports the passed props
import { Colors } from "@/constants/Colors";

interface SubmitButtonProps {
  title: string;
  disabled?: boolean;
  loadingAnimation?: React.ReactNode;
  loading?: boolean;
  titleStyle?: StyleProp<TextStyle>;
  btnContainerStyle?: StyleProp<ViewStyle>;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  title,
  disabled,
  btnContainerStyle,
  titleStyle,
  loadingAnimation,
  loading,
}) => {
  const { handleSubmit } = useFormikContext();

  return (
    <AppButton
      disabled={disabled}
      title={title}
      loadingAnimation={loadingAnimation}
      onPress={handleSubmit}
      titleStyle={titleStyle}
      btnContainerStyle={btnContainerStyle}
      loading={loading}
    />
  );
};

const styles = StyleSheet.create({});

export default SubmitButton;
