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

import easyBuy from "@/app/api/easyBuy";
import { Colors } from "@/constants/Colors";
import AppText from "../AppText";
import ErrorModal from "../ErrorModal";
import AppForm from "../forms/AppForm";
import AppFormField from "../forms/AppFormField";
import AppFormImagePicker from "../forms/AppFormImagePicker";
import SubmitButton from "../forms/SubmitButton";
import LoadingModal from "../LoadingModal";
import SuccessModal from "../SuccessModal";

interface SwapProductProps {
  isVisible: boolean;
  onClose: () => void;
}

interface SuccessResponse {
  message: string;
  data: any;
  success: boolean;
}

interface ErrorMsg {
  msg: string;
}

const validationSchema = Yup.object().shape({
  productToSwapId: Yup.string().required("Swap product ID is required"),
  productName: Yup.string().required("Product name is required"),
  productModal: Yup.string().required("Product model is required"),
  productBrand: Yup.string().required("Product brand is required"),
  productDescription: Yup.string().required("Description is required"),
  front: Yup.mixed().required("Front image is required"),
  back: Yup.mixed().required("Back image is required"),
  receipt: Yup.mixed().required("Receipt image is required"),
  box: Yup.mixed().required("Box image is required"),
});

const SwapProduct: React.FC<SwapProductProps> = ({ isVisible, onClose }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    const result = await easyBuy.addProduct(values); // Implement this API call

    if (!result.ok) {
      const responseData = result.data as ErrorMsg;
      setResponseMessage(responseData.msg);
      showModal("error");
    } else {
      const responseData = result.data as SuccessResponse;
      setResponseMessage(responseData.message);
      showModal("success");
    }

    setLoading(false);
  };

  const showModal = (modalName: string) => {
    setCurrentModal(modalName);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setCurrentModal(null);
  };

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

          <AppText style={styles.labelTitle}>Add Product to Swap</AppText>

          <ScrollView contentContainerStyle={styles.scrollView}>
            <AppForm
              initialValues={{
                productToSwapId: "",
                productName: "",
                productModal: "",
                productBrand: "",
                productDescription: "",
                front: null,
                back: null,
                receipt: null,
                box: null,
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <AppText style={styles.label}>Product To Swap ID</AppText>
              <AppFormField name="productToSwapId" placeholder="e.g. 1234" />

              <AppText style={styles.label}>Product Name</AppText>
              <AppFormField name="productName" placeholder="e.g. iPhone 12" />

              <AppText style={styles.label}>Product Model</AppText>
              <AppFormField name="productModal" placeholder="e.g. A2172" />

              <AppText style={styles.label}>Product Brand</AppText>
              <AppFormField name="productBrand" placeholder="e.g. Apple" />

              <AppText style={styles.label}>Description</AppText>
              <AppFormField
                name="productDescription"
                placeholder="e.g. Slightly used, great condition"
                multiline
              />

              <AppText style={styles.label}>Front Image</AppText>
              <AppFormImagePicker name="front" />

              <AppText style={styles.label}>Back Image</AppText>
              <AppFormImagePicker name="back" />

              <AppText style={styles.label}>Receipt Image</AppText>
              <AppFormImagePicker name="receipt" />

              <AppText style={styles.label}>Box Image</AppText>
              <AppFormImagePicker name="box" />

              <SubmitButton
                title="Submit"
                btnContainerStyle={styles.btn}
                titleStyle={styles.titleStyle}
              />
            </AppForm>
          </ScrollView>
        </View>
      </View>

      <ErrorModal
        visible={modalVisible && currentModal === "error"}
        onClose={hideModal}
        responseText={responseMessage || "Submission failed"}
      />

      <SuccessModal
        visible={modalVisible && currentModal === "success"}
        onClose={() => {
          hideModal();
          onClose();
        }}
        responseText={responseMessage || "Product successfully added"}
      />

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
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
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

export default SwapProduct;
