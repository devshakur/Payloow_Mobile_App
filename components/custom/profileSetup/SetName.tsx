import React, { Component, FunctionComponent, useState } from "react";
import AppButton from "../AppButton";
import AppFormField from "../forms/AppFormField";
import AppText from "../AppText";
import AppForm from "../forms/AppForm";
import { Colors } from "@/constants/Colors";
import { StyleSheet, View } from "react-native";
import * as Yup from "yup";
import SubmitButton from "../forms/SubmitButton";
import { useForm } from "../../../app/context/FormContext";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required().label("First Name"),
  lastName: Yup.string().required().label("Last Name"),
});

interface SetNameProps {
  onClose: (updatedValues?: any) => void;
}

const SetName: FunctionComponent<SetNameProps> = ({ onClose }) => {
  const { formValues, setFormValues } = useForm();
  return (
    <AppForm
      initialValues={{
        firstName: formValues.firstName || "",
        lastName: formValues.lastName || "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        setFormValues((prev) => ({ ...prev, ...values }));
      
        onClose(values);
      }}
    >
      <View style={styles.formContainer}>
        <View style={styles.field}>
          <AppText style={styles.label}>First Name</AppText>
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="name-phone-pad"
            name="firstName"
            placeholder="First Name"
            textContentType="name"
          />
        </View>
        <View style={styles.field}>
          <AppText style={styles.label}>Last Name</AppText>
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="name-phone-pad"
            name="lastName"
            placeholder="Last Name"
            textContentType="name"
          />
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
  btn: {
    backgroundColor: Colors.app.primary,
    width: "100%",
    color: Colors.app.white,
  },
  titleStyle: {
    fontWeight: "normal",
    fontSize: 16,
    color: Colors.app.white,
  },
  label: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "600",
    height: 20,
    color: Colors.app.dark,
    alignSelf: "flex-start",
  },
  field: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
  },
  formContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    width: "90%",
    gap: 10,
  },
});

export default SetName;
