import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface AppTextInputProps extends TextInputProps {
  iconType?: any;
  style?: any;
  passwordVisible?: boolean;
  togglePasswordVisibility?: () => void;
  onPress?: () => void;
  borderColor?: string;
  rightIcon?: string;
  customTextStyle?: any;
  textContentType?:
    | "name"
    | "none"
    | "URL"
    | "addressCity"
    | "addressCityAndState"
    | "addressState"
    | "countryName"
    | "creditCardNumber"
    | "creditCardExpiration"
    | "creditCardExpirationMonth"
    | "emailAddress"
    | "password"
    | undefined;
}

const AppTextInput: React.FC<AppTextInputProps> = ({
  iconType,
  style,
  passwordVisible,
  togglePasswordVisibility,
  onPress,
  rightIcon,
  textContentType,
  borderColor,
  customTextStyle,
  ...otherProps
}) => {
  return (
    <View style={[styles.container, style, { borderColor: borderColor }]}>
      <TextInput
        textContentType={textContentType}
        style={[styles.textInput, customTextStyle]}
        secureTextEntry={otherProps.secureTextEntry}
        {...otherProps}
      />
      {textContentType === "password" ? (
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={togglePasswordVisibility}
        >
          <MaterialIcons
            name={passwordVisible ? "visibility" : "visibility-off"}
            size={24}
            color={Colors.app.dark}
          />
        </TouchableOpacity>
      ) : rightIcon ? (
        <TouchableOpacity style={{ marginRight: 10 }} onPress={onPress}>
          <MaterialCommunityIcons
            name={rightIcon as any}
            size={24}
            iconColor={Colors.app.dark}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.app.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 7,
    width: "100%",
    borderColor: Colors.app.input,
    borderWidth: 1,
  },
  textInput: {
    flex: 1,
    borderColor: Colors.app.dark,
    fontSize: 16,
    padding: 10,
    color: Colors.app.dark,
  },
});

export default AppTextInput;
