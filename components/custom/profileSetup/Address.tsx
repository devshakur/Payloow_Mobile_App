import { Colors } from "@/constants/Colors";
import { FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";
import * as Yup from "yup";
import { useForm } from "../../../app/context/FormContext";
import AppText from "../AppText";
import AppForm from "../forms/AppForm";
import AppFormField from "../forms/AppFormField";
import AppFormPicker from "../forms/AppFormPicker";
import SubmitButton from "../forms/SubmitButton";

const validationSchema = Yup.object().shape({
  country: Yup.string().required().label("Country"),
  state: Yup.string().required().label("State"),
  address: Yup.string().required().label("Address"),
});

interface AddressProps {
  onClose: (updatedValues?: any) => void;
}

const Address: FunctionComponent<AddressProps> = ({ onClose }) => {
  const states = [
    {
      label: "Kano",
      value: "KN",
    },
    {
      label: "Abuja",
      value: "ABJ",
    },
    {
      label: "Lagos",
      value: "LG",
    },
  ];
  const { formValues, setFormValues } = useForm();

  const countries = [{ label: "Nigeria", value: "NG" }];
  return (
    <AppForm
      initialValues={{
        country: formValues.country || "",
        state: formValues.state || "",
        address: formValues.address || "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        setFormValues((prev) => ({ ...prev, ...values }));
     
        onClose(values);
      }}
    >
      <View style={styles.formContainer}>
        <View style={[styles.field]}>
          <AppText style={styles.label}>Country</AppText>
          <AppFormPicker
            placeholder={{ label: "Select a Country", value: null }}
            name="country"
            items={countries}
          />
        </View>

        <View style={[styles.field]}>
          <AppText style={styles.label}>State</AppText>
          <AppFormPicker
            placeholder={{ label: "Select a State", value: null }}
            name="state"
            items={states}
          />
        </View>

        <View style={styles.field}>
          <AppText style={styles.label}>Address</AppText>
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="name-phone-pad"
            name="address"
            placeholder="Enter your home address"
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
    margin: 0,
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
    width: "100%",
  },
  formContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    width: "90%",
    gap: 2,
  },
});
export default Address;
