import React from "react";
import { Text, TextProps } from "react-native";
import { CustomTextStyle } from '../../constants/CustomTextStyle';

// Define a type for the component props
interface AppTextProps extends TextProps {
  children?: React.ReactNode; 
  style?: object; 
}

function AppText({ children, style, ...otherProps }: AppTextProps) {
  return (
    <Text style={[CustomTextStyle.text, style]} {...otherProps}>
      {children}
    </Text>
  );
}

export default AppText;
