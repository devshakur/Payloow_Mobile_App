import AppText from "@/components/custom/AppText";
import AppForm from "@/components/custom/forms/AppForm";
import AppFormOtpInput from "@/components/custom/forms/AppFormOtpInput";
import { Colors } from "@/constants/Colors";
import React, { FunctionComponent, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";
import SubmitButton from "../forms/SubmitButton";
import { useForm } from "../../../app/context/FormContext";

interface RePinScreenProps {
  onClose: (updatedValues?: any) => void;
}

const RePin: FunctionComponent<RePinScreenProps> = ({ onClose }) => {
  const { formValues, setFormValues } = useForm();

  // **Dynamic validation schema**
  const validationSchema = Yup.object().shape({
    rePin: Yup.string()
      .required("Pin is required")
      .length(4, "Pin must be exactly 4 digits")
      .test("pin-match", "Pins do not match", function (value) {
        if (formValues.pin) {
          return value === formValues.pin;
        }
      })
      .label("rePin"),
  });

  return (
    <AppForm
      initialValues={{
        // rePin: formValues.rePin || "",
        rePin: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        // setFormValues((prev) => ({ ...prev, ...values }));
        onClose(values);
      }}
    >
      <View style={styles.formContainer}>
        <View style={styles.CODEContainer}>
          <AppText style={styles.CODELabel}>Repeat transfer Pin</AppText>
          <AppFormOtpInput name="rePin" numberOfDigits={4} />
          <TouchableOpacity
            style={{ alignSelf: "flex-end" }}
            onPress={() => setFormValues((prev) => ({ ...prev, pin: "" }))}
          >
            <AppText style={styles.change}>Reset</AppText>
          </TouchableOpacity>
        </View>
        <SubmitButton
          btnContainerStyle={styles.btn}
          titleStyle={styles.titleStyle}
          title="Proceed"
        />
      </View>
    </AppForm>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    gap: 150,
  },
  titleStyle: {
    fontWeight: "normal",
    fontSize: 16,
    color: Colors.app.white,
  },
  CODEContainer: {
    width: "70%",
    height: "auto",
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "column",
    gap: 12,
  },
  CODELabel: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "600",
    height: 20,
    color: Colors.app.black,
    alignSelf: "center",
  },
  btn: {
    backgroundColor: Colors.app.primary,
    width: "90%",
    color: Colors.app.white,
  },
  change: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "600",
    height: 20,
    color: Colors.app.primary,
    alignSelf: "flex-end",
  },
});

export default RePin;
