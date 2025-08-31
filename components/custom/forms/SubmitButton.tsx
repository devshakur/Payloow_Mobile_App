import { useFormikContext } from "formik";
import React from "react";
import {
    ActivityIndicator,
    StyleProp,
    TextStyle,
    ViewStyle,
} from "react-native";

import { Colors } from "@/constants/Colors";
import AppButton from "../AppButton";

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

  // Default loading animation if none provided
  const defaultLoadingAnimation = <ActivityIndicator size="small" color={Colors.app.white} />;

  return (
    <AppButton
      disabled={disabled || loading}
      title={title}
      loadingAnimation={loadingAnimation || defaultLoadingAnimation}
      onPress={handleSubmit}
      titleStyle={titleStyle}
      btnContainerStyle={btnContainerStyle}
      loading={loading}
    />
  );
};

export default SubmitButton;
