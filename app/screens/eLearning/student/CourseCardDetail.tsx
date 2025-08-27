import AppText from "@/components/custom/AppText"; // adjust path
import { Colors } from "@/constants/Colors";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import AppButton from "../../../../components/custom/AppButton";
import ErrorModal from "../../../../components/custom/ErrorModal";
import List from "../../../../components/custom/list/List";
import LoadingModal from "../../../../components/custom/LoadingModal";
import Screen from "../../../../components/custom/Screen";
import SuccessModal from "../../../../components/custom/SuccessModal";
import elearning from "../../../api/elearning";

interface CourseCardDetailProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

type RootStackParamList = {};

interface CartCourse {
  _id: string;
  title: string;
  tutor_id: string;
  price: number;
  discount_price: number;
  thumbnailUrl: string;
}

interface CartItem {
  _id: string;
  user_id: string;
  course_id: CartCourse;
  PaymentStatus: "pending" | "completed" | "failed";
  created_at: string;
  __v: number;
}

interface GetCartItemsResponse {
  cart: CartItem[];
}

interface ErroResponse {
  error: string;
}

type CourseCardDetailRouteProp = RouteProp<RootStackParamList>;

const CourseCardDetail: React.FC<CourseCardDetailProps> = ({ navigation }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");


  const route = useRoute<CourseCardDetailRouteProp>();

  let {
    courseId,
  }: {
    courseId: string;
  } = route.params ?? {};

  const getCart = async () => {
    try {
      setLoading(true);
      const result = await elearning.getCart();

 
      if (result.ok) {
        const data = result.data as GetCartItemsResponse;
        setCartItems(data.cart); // access 'cart' not 'data'
      } else {
        setErrorMessage("Failed to fetch cart items");
      }
    } catch (error) {
      setErrorMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const deleteCart = async (courseId: string) => {
    try {
      setLoading(true);
      const result = await elearning.removeFromCart(courseId);
      if (result.ok) {
        await getCart();
      }
    } catch (error) {
      setErrorMessage("Failed to delete item");
    } finally {
      setLoading(false);
    }
  };

  const checkOut = async () => {
    try {
      setLoading(true);
      const result = await elearning.enrollFromCart();
  
      if (result.ok) {
        setSuccessMessage("Success");
      }
      const data = result.data as ErroResponse;
      setErrorMessage(data.error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const renderItem = ({ item }: { item: CartItem }) => {
    const course = item.course_id;

    return (
      <List
        listStyle={{
          paddingHorizontal: 20,
          backgroundColor: Colors.app.white,
          height: 100,
          width: "100%",
          alignSelf: "center",
        }}
        leftTopLabelStyle={styles.topLabel}
        leftBottomLabelStyle={styles.bottomLabel}
        leftTopLabel={course.title}
        leftBottomLabel={`₦ ${course.discount_price.toLocaleString()}`}
        rightIcon={
          <View style={styles.rightControls}>
            <TouchableOpacity onPress={() => deleteCart(course._id)}>
              <AppText style={styles.remove}>Remove</AppText>
            </TouchableOpacity>
          </View>
        }
      />
    );
  };

  return (
    <Screen>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
      />
      <View style={styles.btnContainer}>
        <View
          style={{
            width: "50%",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "flex-start",
          }}
        >
          <AppButton
            titleStyle={styles.titleStyle}
            btnContainerStyle={[
              styles.btn,
              { backgroundColor: Colors.app.primary },
            ]}
            title="Purchase"
            onPress={async () => await checkOut()}
          />
        </View>
      </View>
      {loading && <LoadingModal visible={loading} />}

      <ErrorModal
        responseText={errorMessage}
        visible={Boolean(errorMessage)}
        onClose={() => setErrorMessage("")}
      />

      <SuccessModal
        responseText={successMessage}
        visible={Boolean(successMessage)}
        onClose={() => setSuccessMessage("")}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  imgContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 10,
  },
  topLabel: {
    fontWeight: "bold",
    fontSize: 15,
    color: Colors.app.dark,
  },
  bottomLabel: {
    color: Colors.app.primary,
    fontSize: 13,
  },
  rightControls: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  remove: {
    color: "red",
    marginTop: 5,
    fontSize: 12,
  },
  titleStyle: {
    fontSize: 14,
    color: Colors.app.white,
    fontWeight: "500",
    fontStyle: "normal",
    fontFamily: "DM Sans",
    lineHeight: 20,
  },
  btnContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    alignSelf: "center",
    backgroundColor: Colors.app.white,
    zIndex: 10,
    position: "absolute",
    bottom: 190,
    paddingVertical: 15,
  },
  btn: {
    backgroundColor: Colors.app.white,
    width: "50%",
    color: Colors.app.white,
    height: 50,
    borderColor: Colors.app.primary,
    borderWidth: 1,
  },
});

export default CourseCardDetail;
