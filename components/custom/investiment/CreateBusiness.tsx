import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";

import { Colors } from "@/constants/Colors";
import investment from "../../../app/api/investment";
import AppText from "../../../components/custom/AppText";
import ErrorModal from "../../../components/custom/ErrorModal";
import AppForm from "../../../components/custom/forms/AppForm";
import AppFormField from "../../../components/custom/forms/AppFormField";
import AppFormImagePicker from "../../../components/custom/forms/AppFormImagePicker";
import SubmitButton from "../../../components/custom/forms/SubmitButton";
import LoadingModal from "../../../components/custom/LoadingModal";
import SuccessModal from "../../../components/custom/SuccessModal";
import AppFormMultiSelect from "../forms/AppFormMultiSelect";
import AppFormPicker from "../forms/AppFormPicker";

interface CreateBusinessProps {
  isVisible: boolean;
  onClose: () => void;
}

const validationSchema = Yup.object().shape({
  businessName: Yup.string().required("Business name is required"),
  businessDescription: Yup.string().required(
    "Business description is required"
  ),
  businessStage: Yup.string().required("Business stage is required"),
  customerModel: Yup.string().required("Customer model is required"),
  industry: Yup.array().min(1, "Select at least one industry"),
  website: Yup.string().url("Enter a valid URL"),
  twitter_url: Yup.string().url("Enter a valid URL"),
  linkedIn_url: Yup.string().url("Enter a valid URL"),
  facebook_url: Yup.string().url("Enter a valid URL"),
  youTube_url: Yup.string().url("Enter a valid URL"),
  instagram_url: Yup.string().url("Enter a valid URL"),
  tikTok_url: Yup.string().url("Enter a valid URL"),
  financialStatements: Yup.mixed(),
  growthPlans: Yup.mixed(),
  loanRequirements: Yup.mixed(),
});

const industries = [
  { label: "Fintech", value: "fintech" },
  { label: "Agriculture", value: "agriculture" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Education", value: "education" },
  { label: "E-commerce", value: "ecommerce" },
  { label: "Transportation", value: "transportation" },
  { label: "Energy", value: "energy" },
  { label: "Real Estate", value: "real_estate" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Food & Beverage", value: "food_beverage" },
  { label: "Tourism & Hospitality", value: "tourism_hospitality" },
  { label: "Logistics", value: "logistics" },
  { label: "Telecommunications", value: "telecommunications" },
  { label: "Manufacturing", value: "manufacturing" },
  { label: "Media & Advertising", value: "media_advertising" },
  { label: "Automotive", value: "automotive" },
  { label: "Fashion & Apparel", value: "fashion_apparel" },
  { label: "Technology", value: "technology" },
  { label: "Consulting", value: "consulting" },
  { label: "Non-Profit", value: "non_profit" },
];

const CreateBusiness: React.FC<CreateBusinessProps> = ({
  isVisible,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const showModal = (type: "success" | "error", message: string) => {
    setCurrentModal(type);
    setResponseMessage(message);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setCurrentModal(null);
  };

  const getMimeType = (uri: string): string => {
    const ext = uri.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "pdf":
        return "application/pdf";
      default:
        return "application/octet-stream";
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);

    const formData = new FormData();

    formData.append("businessName", values.businessName);
    formData.append("businessDescription", values.businessDescription);
    formData.append("businessStage", values.businessStage);
    formData.append("customerModel", values.customerModel);
    formData.append("website", values.website);

    // Industry as array
    if (Array.isArray(values.industry)) {
      values.industry.forEach((item: string) => {
        formData.append("industry[]", item);
      });
    }

    const fileKeys = ["financialStatements", "growthPlans", "loanRequirements"];
    for (const key of fileKeys) {
      const uri = values[key];
      if (uri) {
        const ext = uri.split(".").pop()?.toLowerCase() || "jpg";
        const type = getMimeType(uri);
        formData.append(key, {
          uri,
          name: `${key}.${ext}`,
          type,
        } as any);
      }
    }

    try {
      const result = await investment.createBusiness(formData);

      if (result.ok) {
        showModal("success", "Business created successfully.");
      } else {
        showModal("error", "Failed to create business.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      showModal("error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const scrollRef = useRef<ScrollView>(null);
  const handleFocus = () => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 300); // slight delay to wait for dropdown animation
  };

  const stages = [
    { label: "Idea", value: "idea" },
    { label: "Startup", value: "startup" },
    { label: "Growth", value: "growth" },
    { label: "Mature", value: "mature" },
  ];

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={styles.nutch} />
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <MaterialCommunityIcons
              name="close"
              size={24}
              color={Colors.app.black}
            />
          </TouchableOpacity>

          <AppText style={styles.labelTitle}>Create Business</AppText>

          <ScrollView contentContainerStyle={styles.scrollView}>
            <AppForm
              initialValues={{
                businessName: "",
                businessDescription: "",
                businessStage: "",
                customerModel: "",
                industry: [],
                website: "",
                twitter_url: "",
                linkedIn_url: "",
                facebook_url: "",
                youTube_url: "",
                instagram_url: "",
                tikTok_url: "",
                financialStatements: null,
                growthPlans: null,
                loanRequirements: null,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <AppFormField name="businessName" placeholder="Business Name" />

              <AppFormMultiSelect
                name="industry"
                data={industries}
                placeholder={"Select Industries"}
                onFocus={handleFocus}
              />

              <AppFormField
                name="businessDescription"
                placeholder="Description"
              />

              <AppFormPicker
                name="businessStage"
                items={stages}
                placeholder={{ label: "Select Stage", value: null }}
              />
              <AppFormField
                name="customerModel"
                placeholder="Customer Model (e.g., b2b)"
              />

              <AppFormField name="website" placeholder="Website URL" />
              <AppFormField name="twitter_url" placeholder="Twitter URL" />
              <AppFormField name="linkedIn_url" placeholder="LinkedIn URL" />
              <AppFormField name="facebook_url" placeholder="Facebook URL" />
              <AppFormField name="youTube_url" placeholder="YouTube URL" />
              <AppFormField name="instagram_url" placeholder="Instagram URL" />
              <AppFormField name="tikTok_url" placeholder="TikTok URL" />

              <AppText style={styles.label}>Financial Statement</AppText>
              <AppFormImagePicker name="financialStatements" />

              <AppText style={styles.label}>Growth Plans</AppText>
              <AppFormImagePicker name="growthPlans" />

              <AppText style={styles.label}>Loan Requirements</AppText>
              <AppFormImagePicker name="loanRequirements" />

              <SubmitButton
                title="Submit Business"
                btnContainerStyle={styles.btn}
                titleStyle={styles.titleStyle}
              />
            </AppForm>
          </ScrollView>
        </View>

        {currentModal === "error" && (
          <ErrorModal
            visible={modalVisible}
            onClose={hideModal}
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
            responseText={responseMessage || "Business created successfully"}
          />
        )}
        {loading && <LoadingModal visible={loading} />}
      </View>
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
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginVertical: 10,
    color: Colors.app.black,
  },
  btn: {
    marginTop: 20,
    backgroundColor: Colors.app.primary,
  },
  titleStyle: {
    color: Colors.app.white,
    fontWeight: "bold",
  },
});

export default CreateBusiness;
