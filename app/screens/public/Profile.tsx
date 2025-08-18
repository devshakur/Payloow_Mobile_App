import useAuth from "@/app/auth/useAuth";
import { useScreen } from "@/app/context/ScreenProvider";
import { UserData, useUser } from "@/app/context/UserProvider";
import routes from "@/app/navigations/routes";
import List from "@/components/custom/list/List";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import {
  FontAwesome6,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import * as ImagePicker from "expo-image-picker";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Alert, Image, RefreshControl, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AppButton from "../../../components/custom/AppButton";
import ErrorModal from "../../../components/custom/ErrorModal";
import SuccessModal from "../../../components/custom/SuccessModal";
import userDetails from "../../api/userDetails";

type RootStackParamList = {
  Buyer: undefined;
  Partner: undefined;
  InvestorHomeNavigator: undefined;
  TutorHomeNavigator: undefined;
  StudentHomeNavigator: undefined;
  ChangeEmail: undefined;
  ChangePassword: undefined;
  Transactions: undefined;
  Orders: undefined;
  UserMainProfile: undefined;
  ChangePin: undefined;
};

interface Response {
  message: string;
  data: {
    profilePicture: string;
  };
  success: boolean;
}

interface ProfileProps {
  navigation: DrawerNavigationProp<RootStackParamList>;
}

const Profile: FunctionComponent<ProfileProps> = ({ navigation }) => {
  const { dashboard } = useScreen();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const { user, setUser } = useUser();
  const { logOut } = useAuth();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserData().finally(() => setRefreshing(false));
  }, []);

  const getMimeType = (uri: string): string => {
    const ext = uri.split(".").pop()?.toLowerCase();
    if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
    if (ext === "png") return "image/png";
    return "image/jpeg"; // Fallback
  };

  const uploadProfileImage = async (imageUri: any) => {
    const formData = new FormData();
    const mime = getMimeType(imageUri);
    const ext = mime.split("/")[1];

    formData.append("profilePicture", {
      uri: imageUri,
      name: `main.${ext}`,
      type: mime,
    } as any);



    try {
      const response = await userDetails.setProfileImage(formData);
      const res = response.data as Response;

      if (response.ok) {
        setResponseMessage(res.message);
        showModal("success");
        return true;
      } else {
        setResponseMessage(res.message || "Failed to upload image");
        showModal("error");
        return false;
      }
    } catch (error) {
      Alert.alert("Upload Failed", "Could not upload profile image.");
      console.error("Upload error:", error);
      return false;
    }
  };

  const fetchUserData = async () => {
    setRefreshing(true);
    try {
      // Fetch user data
      const userResult = await userDetails.getUser();
      const userData = userResult.data as UserData;
      if (userResult.ok) {
        setUser(userData);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      // logOut();
   
    } finally {
      setRefreshing(false);
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Error", "Permission to access camera roll is required!");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImage(uri);
        setRefreshing(true);
        const uploaded = await uploadProfileImage(uri);
        if (uploaded) {
          await fetchUserData();
        }
      }
    } catch (error) {
      Alert.alert("Error", "Could not open media library. Try again later.");
      console.error("Image Picker Error:", error);
    } finally {
      setRefreshing(false);
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

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          <View style={styles.heading}>
            <View style={styles.switchContainer}>
              <MaterialCommunityIcons
                name="arrow-left"
                color={Colors.app.black}
                size={25}
                onPress={() => navigation.goBack()}
              />
            </View>
          </View>
          <View style={styles.content}>
            <Image
              style={styles.profileImage}
              source={{ uri: user?.data.profilePicture || "" }}
            />

            <MaterialCommunityIcons
              name="camera"
              size={40}
              color={Colors.app.primary}
              onPress={pickImage}
              style={styles.cameraIcon}
            />

            <View style={styles.btnContainer}>
              <AppButton
                titleStyle={styles.titleStyle}
                btnContainerStyle={styles.btn}
                title={`${dashboard} `}
              />
            </View>

            <View style={styles.transaction}>
              <List
                leftIcon={
                  <MaterialCommunityIcons
                    name="account"
                    size={30}
                    color={Colors.app.primary}
                  />
                }
                leftLabel="Personal Detail"
                rightIcon={
                  <MaterialCommunityIcons
                    name="chevron-right"
                    color={Colors.app.black}
                    size={24}
                  />
                }
                onPress={() => navigation.navigate(routes.USER_MAIN_PROFILE)}
              />
              <List
                leftIcon={
                  <FontAwesome6
                    name="receipt"
                    size={24}
                    color={Colors.app.primary}
                  />
                }
                leftLabel="Transaction history"
                rightIcon={
                  <MaterialCommunityIcons
                    name="chevron-right"
                    color={Colors.app.black}
                    size={24}
                  />
                }
                onPress={() => navigation.navigate(routes.TRANSACTIONS)}
              />
            </View>
            <View style={styles.setting}>
              <List
                leftIcon={
                  <MaterialCommunityIcons
                    name="security"
                    size={24}
                    color={Colors.app.primary}
                  />
                }
                leftLabel="Change Pin"
                rightIcon={
                  <MaterialCommunityIcons
                    name="chevron-right"
                    color={Colors.app.black}
                    size={24}
                  />
                }
                onPress={() => navigation.navigate(routes.CHNAGE_PIN)}
              />
              <List
                leftIcon={
                  <MaterialCommunityIcons
                    name="lock"
                    size={24}
                    color={Colors.app.primary}
                  />
                }
                leftLabel="Change Password"
                rightIcon={
                  <MaterialCommunityIcons
                    name="chevron-right"
                    color={Colors.app.black}
                    size={24}
                  />
                }
                onPress={() => navigation.navigate(routes.CHNAGE_PASSWORD)}
              />

              <List
                leftIcon={
                  <MaterialCommunityIcons
                    name="email"
                    size={24}
                    color={Colors.app.primary}
                  />
                }
                leftLabel="Change Email"
                rightIcon={
                  <MaterialCommunityIcons
                    name="chevron-right"
                    color={Colors.app.black}
                    size={24}
                  />
                }
                onPress={() => navigation.navigate(routes.CHNAGE_EMAIL)}
              />
              <List
                leftIcon={
                  <SimpleLineIcons
                    name="earphones-alt"
                    size={24}
                    color={Colors.app.primary}
                  />
                }
                leftLabel="Support"
                rightIcon={
                  <MaterialCommunityIcons
                    name="chevron-right"
                    color={Colors.app.black}
                    size={24}
                  />
                }
              />

              <List
                leftIcon={
                  <MaterialCommunityIcons
                    name="logout"
                    size={24}
                    color={Colors.app.primary}
                  />
                }
                leftLabel="Logout"
                rightIcon={
                  <MaterialCommunityIcons
                    name="chevron-right"
                    color={Colors.app.black}
                    size={24}
                  />
                }
                onPress={() => logOut()}
              />
            </View>
          </View>
        </View>
        {currentModal === "error" && (
          <ErrorModal
            visible={modalVisible}
            onClose={() => hideModal()}
            responseText={responseMessage || "Submission failed"}
          />
        )}
        {currentModal === "success" && (
          <SuccessModal
            visible={modalVisible}
            onClose={() => hideModal()}
            responseText={responseMessage || "Success"}
          />
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    flexDirection: "column",
    gap: 25,
    marginTop: 10,
  },
  heading: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  content: {
    width: "90%",
    alignItems: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  switch: {
    color: Colors.app.black,
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "DM Sans",
    marginLeft: 6,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: Colors.app.primary,
  },
  cameraIcon: {
    position: "absolute",
    top: 115,
    right: 100,
    backgroundColor: Colors.app.white,
    borderRadius: 20,
    padding: 5,
    elevation: 4, // for shadow effect on Android
    shadowColor: "#000", // for iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  titleStyle: {
    fontSize: 14,
    color: Colors.app.primary,
    fontWeight: "500",
    fontFamily: "DM Sans",
    lineHeight: 20,
  },
  btnContainer: {
    width: "100%",
    marginTop: 20,
    alignItems: "center",
  },
  btn: {
    width: "80%",
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.app.primary,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.app.white,
  },
  transaction: {
    backgroundColor: Colors.app.white,
    width: "100%",
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  setting: {
    backgroundColor: Colors.app.white,
    width: "100%",
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});

export default Profile;
