import easyBuy from "@/app/api/easyBuy";
import { useUser } from "@/app/context/UserProvider";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import AppText from "../AppText";
import ErrorModal from "../ErrorModal";
import AppForm from "../forms/AppForm";
import AppFormField from "../forms/AppFormField";
import AppFormPicker from "../forms/AppFormPicker";
import SubmitButton from "../forms/SubmitButton";
import LoadingModal from "../LoadingModal";
import SuccessModal from "../SuccessModal";

interface JoinEasyBuyProps {
  isVisible: boolean;
  onClose: () => void;
  // onSubmit: (values: any) => void;
  userRole?: "buyer" | "partner"; // <-- NEW
}

interface SuccessResponse {
  data: {
    __v: number;
    _id: string;
    address: string;
    bvn: string;
    country: string;
    createdAt: string; // ISO Date string
    deliveryInformation: string;
    easyBuyRole: "buyer" | "partner" | string; // adjust as needed
    employmentStatus: string;
    fullName: string;
    income: number;
    nin: string;
    phoneNumber: string;
    referralCode: string;
    state: string;
    updatedAt: string; // ISO Date string
    user: string;
  };
  message: string;
  success: boolean;
}

interface ErrorMsg {
  msg: string;
}

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  address: Yup.string().required("Address is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  nin: Yup.string()
    .length(11, "NIN must be 11 digits")
    .required("NIN required"),
  bvn: Yup.string()
    .length(11, "BVN must be 11 digits")
    .required("BVN required"),
  easyBuyRole: Yup.string().required("Role is required"),
  employmentStatus: Yup.string().required("Employment status is required"),
  referralCode: Yup.string(),
  income: Yup.string().required("Income is required"),
});

const JoinEasyBuy: React.FC<JoinEasyBuyProps> = ({
  isVisible,
  onClose,
  userRole,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>();
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {

    setLoading(true);

    const result = await easyBuy.joinEasyBuy(values);

    if (!result.ok) {
      const responseData = result.data as ErrorMsg;
      showModal("error");
      setResponseMessage(responseData.msg);
      return setLoading(false);
    } else {
      const responseData = result.data as SuccessResponse;
      showModal("success");
      setResponseMessage(responseData.message);
      return setLoading(false);
    }
  };

  // Show modal
  const showModal = (modalName: string) => {
    setCurrentModal(modalName);
    setModalVisible(true);
  };

  // Hide modal
  const hideModal = () => {
    setModalVisible(false);
    setCurrentModal(null);
  };

  const modules = [
    { label: "Buyer", value: "buyer" },
    { label: "Partner", value: "partner" },
  ].filter((item) => !userRole || item.value === userRole);

  const jobStatus = [
    { label: "Employed", value: "Employed" },
    { label: "UnEmployed", value: "UnEmployed" },
  ];

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

  const countries = [{ label: "Nigeria", value: "NG" }];

  const { user } = useUser();

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={styles.nutch} />
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <MaterialCommunityIcons
              name="close"
              color={Colors.app.black}
              size={24}
            />
          </TouchableOpacity>

          <AppText style={styles.labelTitle}>Join Easy Buy</AppText>

          <ScrollView contentContainerStyle={styles.scrollView}>
            <AppForm
              initialValues={{
                fullName: "",
                email: "",
                phoneNumber: "",
                address: "",
                state: "",
                country: "",
                nin: "",
                bvn: "",
                easyBuyRole: "",
                employmentStatus: "",
                referralCode: "",
                income: "",
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <View style={styles.formFields}>
                <AppText style={styles.label}>Full Name</AppText>
                <AppFormField
                  name="fullName"
                  placeholder="Full Name"
                  autoCapitalize="none"
                  autoCorrect={false}
                  // value={`${user?.data.firstName} ${user?.data.lastName}`}
                />
              </View>

              <View style={styles.field}>
                <AppText style={styles.label}>Email</AppText>
                <AppFormField
                  name="email"
                  placeholder="Email"
                  autoCapitalize="none"
                  autoCorrect={false}
                  // value={user?.data.email}
                />
              </View>

              <View style={styles.field}>
                <AppText style={styles.label}>Phone Number</AppText>
                <AppFormField
                  name="phoneNumber"
                  placeholder="Phone Number"
                  autoCapitalize="none"
                  autoCorrect={false}
                  // value={user?.data.phone}
                />
              </View>

              <View style={styles.field}>
                <AppText style={styles.label}>Address</AppText>
                <AppFormField
                  name="address"
                  placeholder="Address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  // value={user?.data.Address}
                />
              </View>

              <View style={styles.field}>
                <AppText style={styles.label}>State</AppText>
                <AppFormPicker
                  placeholder={{
                    label: user?.data.state || "Select a state",
                    value: user?.data.state,
                  }}
                  name="state"
                  items={states}
                  style={{
                    backgroundColor: Colors.app.white,
                  }}
                />
              </View>

              <View style={styles.field}>
                <AppText style={styles.label}>Country</AppText>
                <AppFormPicker
                  placeholder={{
                    label: user?.data.country || "Select a country",
                    value: user?.data.country,
                  }}
                  name="country"
                  items={countries}
                  style={{
                    backgroundColor: Colors.app.white,
                  }}
                />
              </View>

              <View style={styles.field}>
                <AppText style={styles.label}>NIN</AppText>
                <AppFormField
                  name="nin"
                  placeholder="NIN"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.field}>
                <AppText style={styles.label}>BVN</AppText>
                <AppFormField
                  name="bvn"
                  placeholder="BVN"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.field}>
                <AppText style={styles.label}>Role</AppText>
                <AppFormPicker
                  placeholder={{ label: "buyer / patner", value: null }}
                  name="easyBuyRole"
                  items={modules}
                  style={{
                    backgroundColor: Colors.app.white,
                  }}
                />
              </View>

              <View style={styles.field}>
                <AppText style={styles.label}>Employment Status</AppText>

                <AppFormPicker
                  placeholder={{ label: "Employed / Unemployed", value: null }}
                  name="employmentStatus"
                  items={jobStatus}
                  style={{
                    backgroundColor: Colors.app.white,
                  }}
                />
              </View>

              <View style={styles.field}>
                <AppText style={styles.label}>Referral Code (Optional)</AppText>
                <AppFormField
                  name="referralCode"
                  placeholder="Referral Code"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.field}>
                <AppText style={styles.label}>Monthly Income</AppText>
                <AppFormField
                  name="income"
                  placeholder="e.g. 10000"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <SubmitButton
                  title="Submit"
                  btnContainerStyle={styles.btn}
                  titleStyle={styles.titleStyle}
                />
              </View>
            </AppForm>
          </ScrollView>
        </View>
      </View>

      {currentModal === "error" && (
        <ErrorModal
          visible={modalVisible}
          onClose={() => {
            hideModal();
          }}
          responseText={responseMessage || "Submission failed"}
        />
      )}
      {currentModal === "success" && (
        <SuccessModal
          visible={modalVisible}
          onClose={() => {
            hideModal();
            onClose();
          }}
          responseText={responseMessage || "Successfully reset password"}
        />
      )}
      {loading && <LoadingModal visible={loading} />}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: Colors.app.screen,
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 10,
    maxHeight: "90%",
    marginTop: 50,
  },
  nutch: {
    width: 120,
    height: 5,
    backgroundColor: Colors.app.black,
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10,
  },
  closeBtn: {
    position: "absolute",
    left: 10,
    top: 10,
    zIndex: 10,
    padding: 10,
  },
  labelTitle: {
    fontFamily: "DM Sans",
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.app.black,
    textAlign: "center",
    marginBottom: 20,
  },
  scrollView: {
    paddingBottom: 40,
  },
  formFields: {
    width: "100%",
  },
  field: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
    color: Colors.app.black,
  },
  btn: {
    backgroundColor: Colors.app.primary,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  titleStyle: {
    fontWeight: "bold",
    fontSize: 16,
    color: Colors.app.white,
    textAlign: "center",
  },
});

export default JoinEasyBuy;
