// screens/Business.tsx
import CreateBusinessHeader from "@/components/custom/investiment/CreateBusinessHeader";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BusinessCard from "../../../components/custom/investiment/BusinessCard";
import CreateBusiness from "../../../components/custom/investiment/CreateBusiness";
import Invest from "../../../components/custom/investiment/Invest";
import Screen from "../../../components/custom/Screen";
import { Colors } from "../../../constants/Colors";
import investment from "../../api/investment";
import { useUser } from "../../context/UserProvider";
import { Business } from "./Request";

type RootStackParamList = {};

interface BusinessesListProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const BusinessesList: FunctionComponent<BusinessesListProps> = ({
  navigation,
}) => {
  const [businessModalVisible, setBusinessModalVisible] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user, setUser } = useUser();

  const fetchBusinesses = async () => {
    setRefreshing(true);
    try {
      const result = await investment.getBusiness();

      if (result.ok) {
        setBusinesses(result.data as Business[]);
      } else {
      }
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    Promise.all([fetchBusinesses()]).finally(() => setRefreshing(false));
  }, [user]);

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <CreateBusinessHeader
        onAddBusiness={() => setBusinessModalVisible(true)}
      />
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={businesses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <BusinessCard
            onLoading={(val) =>
              val === true ? setRefreshing(true) : setRefreshing(false)
            }
            business={item}
          />
        )}
        contentContainerStyle={styles.container}
        ListEmptyComponent={
          <View style={styles.noBusinessContainer}>
            <Text style={styles.noBusinessText}>
              No businesses found. Tap Add Business to create one.
            </Text>
          </View>
        }
      />

      {!businessModalVisible && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setBusinessModalVisible(true)}
        >
          <MaterialCommunityIcons
            name="plus"
            size={24}
            color={Colors.app.white}
          />
        </TouchableOpacity>
      )}

      {user?.data.investmentRole === "debtor" && (
        <CreateBusiness
          isVisible={businessModalVisible}
          onClose={() => setBusinessModalVisible(false)}
        />
      )}

      {user?.data.investmentRole === "investor" && (
        <Invest
          isVisible={businessModalVisible}
          onClose={() => setBusinessModalVisible(false)}
          businesses={businesses}
        />
      )}
    </Screen>
  );
};
const styles = StyleSheet.create({
  container: {},
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noBusinessContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    paddingHorizontal: 20,
  },
  noBusinessText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },

  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 40,
    height: 40,
    backgroundColor: Colors.app.primary,
    borderRadius: 30, // Makes it round
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Shadow for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default BusinessesList;
