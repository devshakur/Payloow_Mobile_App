import easyBuy from "@/app/api/easyBuy";
import useAuth from "@/app/auth/useAuth";
import { Colors } from "@/constants/Colors";
import React, { FunctionComponent, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Yup from "yup";
import AppText from "../AppText";
import ErrorModal from "../ErrorModal";
import AppForm from "../forms/AppForm";
import AppFormField from "../forms/AppFormField";
import AppFormImagePicker from "../forms/AppFormImagePicker";
import AppFormPicker from "../forms/AppFormPicker";
import SubmitButton from "../forms/SubmitButton";
import LoadingModal from "../LoadingModal";
import SuccessModal from "../SuccessModal";
import { GetAllProductsResponse } from "./FeatureProduct";

interface SwapPhoneProps {}

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
const SwapPhone: FunctionComponent<SwapPhoneProps> = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<{ label: string; value: string }[]>([
    { label: "Select category", value: "" },
  ]);
  const { logOut } = useAuth();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    const result = await easyBuy.swapProducts(values); // Implement this API call

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

  // Inside your component:
  // useEffect(() => {
  //   getProducts();
  // }, []);

  const getProducts = async () => {
    try {
      const result = await easyBuy.getProducts();
      const data = result.data as GetAllProductsResponse;
      if (result.ok) {
        const formattedProducts = data.data.data.map((product) => ({
          label: product.name,
          value: String(product._id),
        }));

        setProducts([...formattedProducts]);
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (error) {
      // logOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flexGrow: 1,
        width: "100%",
        padding: 10,
      }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      keyboardShouldPersistTaps="handled"
    >
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

        <AppFormPicker
          placeholder={{ label: "Select a product", value: null }}
          name="productToSwapId"
          items={products}
        />

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
      <ErrorModal
        visible={modalVisible && currentModal === "error"}
        onClose={hideModal}
        responseText={responseMessage || "Submission failed"}
      />

      <SuccessModal
        visible={modalVisible && currentModal === "success"}
        onClose={() => {
          hideModal();
        }}
        responseText={responseMessage || "Product successfully added"}
      />

      {loading && <LoadingModal visible={loading} />}
    </KeyboardAwareScrollView>
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
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
  },
  formContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    width: "95%",
    alignSelf: "center",
    paddingVertical: 15,
  },
  heading: {
    fontFamily: "DM Sans",
    fontSize: 18,
    fontWeight: "600",
    color: Colors.app.dark,
    alignSelf: "flex-start",
  },
});

export default SwapPhone;
