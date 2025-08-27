import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
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
import AppFormPicker from "../forms/AppFormPicker";
import SubmitButton from "../forms/SubmitButton";
import LoadingModal from "../LoadingModal";
import SuccessModal from "../SuccessModal";

export interface Data {
  _id: string;
  name: string;
}

export interface CategoriesResponse {
  data: Data[];
  message: string;
  success: boolean;
}

interface AddProductProps {
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
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  category: Yup.string().required("Category is required"),
  price: Yup.number().required("Price is required"),
  stock: Yup.number().required("Stock is required"),
  color: Yup.array().min(1, "At least one color is required"),
  image: Yup.mixed().required("Main image is required"),
  additionalImage1: Yup.mixed().required("Additional image 1 is required"),
  additionalImage2: Yup.mixed().required("Additional image 2 is required"),
  additionalImage3: Yup.mixed().required("Additional image 3 is required"),
});

interface Category {
  label: string;
  value: string;
}

const AddProduct: React.FC<AddProductProps> = ({ isVisible, onClose }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const getMimeType = (uri: string): string => {
    const ext = uri.split(".").pop()?.toLowerCase();
    if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
    if (ext === "png") return "image/png";
    return "image/jpeg"; // Fallback
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);

    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("category", values.category);
    formData.append("price", String(values.price));
    formData.append("stock", String(values.stock));
    formData.append("color", values.color);

    // Main image
    if (values.image) {
      const mime = getMimeType(values.image);
      const ext = mime.split("/")[1];

      formData.append("image", {
        uri: values.image,
        name: `main.${ext}`,
        type: mime,
      } as any);
    }

    // Append each additional image individually
    if (values.additionalImage1) {
      const mime = getMimeType(values.additionalImage1);
      const ext = mime.split("/")[1];

      formData.append("additionalImages", {
        uri: values.additionalImage1,
        name: `additional1.${ext}`,
        type: mime,
      } as any);
    }

    if (values.additionalImage2) {
      const mime = getMimeType(values.additionalImage2);
      const ext = mime.split("/")[1];

      formData.append("additionalImages", {
        uri: values.additionalImage2,
        name: `additional2.${ext}`,
        type: mime,
      } as any);
    }

    if (values.additionalImage3) {
      const mime = getMimeType(values.additionalImage3);
      const ext = mime.split("/")[1];

      formData.append("additionalImages", {
        uri: values.additionalImage3,
        name: `additional3.${ext}`,
        type: mime,
      } as any);
    }

    try {
      const result = await easyBuy.addProduct(formData);
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
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (modalName: string) => {
    setCurrentModal(modalName);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setCurrentModal(null);
  };

  useEffect(() => {
    if (isVisible) {
      getCategories();
    }
  }, [isVisible]);

  const getCategories = async () => {
    try {
      setLoading(true);
      const result = await easyBuy.getCategories();

      if (result.ok) {
        const data = (result.data as CategoriesResponse).data as Data[];
        const formattedCategories = data.map((category) => ({
          label: category.name,
          value: String(category._id),
        }));
        setCategories([...formattedCategories]);
      } else {
        throw new Error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
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

          <AppText style={styles.labelTitle}>Add Product</AppText>

          <ScrollView contentContainerStyle={styles.scrollView}>
            <AppForm
              initialValues={{
                name: "",
                description: "",
                category: "",
                price: "",
                stock: "",
                color: [],
                image: null,
                additionalImage1: null,
                additionalImage2: null,
                additionalImage3: null,
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <AppText style={styles.label}>Product Name</AppText>
              <AppFormField name="name" placeholder="e.g. MacBook Pro" />

              <AppText style={styles.label}>Description</AppText>
              <AppFormField
                name="description"
                placeholder="Short description..."
                multiline
              />

              <AppText style={styles.label}>Category</AppText>
              <AppFormPicker
                placeholder={{ label: "Select a category", value: null }}
                name="category"
                items={categories}
              />

              <AppText style={styles.label}>Price</AppText>
              <AppFormField
                name="price"
                placeholder="e.g. 1500"
                keyboardType="numeric"
              />

              <AppText style={styles.label}>Stock</AppText>
              <AppFormField
                name="stock"
                placeholder="e.g. 10"
                keyboardType="numeric"
              />

              <AppText style={styles.label}>Color (comma separated)</AppText>
              <AppFormField
                name="color"
                placeholder="e.g. red, blue, green"
                customTransform={(text) => text.split(",").map((c) => c.trim())}
              />

              <AppText style={styles.label}>Main Image</AppText>
              <AppFormImagePicker name="image" />

              <AppText style={styles.label}>Additional Image 1</AppText>
              <AppFormImagePicker name="additionalImage1" />

              <AppText style={styles.label}>Additional Image 2</AppText>
              <AppFormImagePicker name="additionalImage2" />

              <AppText style={styles.label}>Additional Image 3</AppText>
              <AppFormImagePicker name="additionalImage3" />

              <SubmitButton
                title="Submit"
                btnContainerStyle={styles.btn}
                titleStyle={styles.titleStyle}
              />
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
          responseText={responseMessage || "Success"}
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

export default AddProduct;
