import { Colors } from "@/constants/Colors";
import { useFormikContext } from "formik";
import React, { useEffect } from "react";
import { TextInputProps } from "react-native";
import AppTextInput from "../AppTextInput";
import ErrorMessage from "./ErrorMessage";

interface AppFormFieldProps extends TextInputProps {
  iconType?: any;
  name: string;
  apiErrorMessage?: string;
  width?: string | number;
  style?: any;
  passwordVisible?: boolean;
  togglePasswordVisibility?: () => void;
  onPress?: () => void;
  icon?: string;
  setVal?: (value: string) => void;
  ousideVal?: string;
  customTextStyle?: any;
  customTransform?: (input: string) => any;
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

function AppFormField({
  iconType,
  name,
  apiErrorMessage,
  width,
  style,
  passwordVisible,
  togglePasswordVisibility,
  onPress,
  icon,
  setVal,
  ousideVal,
  textContentType,
  customTextStyle,
  customTransform,
  ...otherProps
}: AppFormFieldProps) {
  const { setFieldTouched, setFieldValue, errors, touched, values } =
    useFormikContext<{ [key: string]: any }>();

  // Ensure `errors[name]` is a string
  const errorText =
    (typeof errors[name] === "string"
      ? errors[name]
      : Array.isArray(errors[name])
      ? errors[name].join(", ")
      : undefined) || apiErrorMessage;

  // Ensure `touched[name]` is a boolean
  const isTouched = Boolean(touched[name]);

  useEffect(() => {
    if (ousideVal !== undefined && ousideVal !== values[name]) {
      setFieldValue(name, ousideVal);
  
    } else if (otherProps.defaultValue) {
      setFieldValue(name, otherProps.defaultValue);
      if (setVal) {
        setVal(otherProps.defaultValue);
      }
    }
  }, [ousideVal]);

  return (
    <>
      <AppTextInput
        iconType={iconType}
        textContentType={textContentType}
        onBlur={() => setFieldTouched(name)}
        onChangeText={(text) => {
          const transformedValue = customTransform
            ? customTransform(text)
            : text;
          setFieldValue(name, transformedValue);
          if (setVal) setVal(transformedValue);
        }}
        value={values[name]}
        style={style}
        {...otherProps}
        passwordVisible={passwordVisible}
        togglePasswordVisibility={togglePasswordVisibility}
        onPress={onPress}
        customTextStyle={customTextStyle}
        borderColor={
          errorText && isTouched ? Colors.app.failed : Colors.app.input
        }
      />
      <ErrorMessage error={errorText} visible={isTouched} />
    </>
  );
}

export default AppFormField;
