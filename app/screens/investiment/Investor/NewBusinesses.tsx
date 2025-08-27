import CreateBusiness from "@/components/custom/investiment/CreateBusiness";
import Invest from "@/components/custom/investiment/Invest";
import LoanBusinessCard from "@/components/custom/investiment/LoanBusinessCard";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import investment from "../../../api/investment";
import { useUser } from "../../../context/UserProvider";
import { Business } from "../Request";

const BusinessesWithLoans = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [businessModalVisible, setBusinessModalVisible] = useState(false);
  const { user } = useUser();

  // Fetch + filter (keep logic inside this component)
  const fetchBusinesses = async () => {
    setRefreshing(true);
    try {
      const result = await investment.getBusiness();
      if (result.ok) {
        const all = (result.data as Business[]) || [];

        // supports both shapes: { loan: {...} } OR { loans: [...] }
        const withLoans = all.filter((b: any) => {
          const hasLoanObject =
            b?.loan &&
            typeof b.loan === "object" &&
            Object.keys(b.loan).length > 0;
          const hasLoansArray = Array.isArray(b?.loans) && b.loans.length > 0;
          return hasLoanObject || hasLoansArray;
        });

        setBusinesses(withLoans);
      }
    } catch (e) {
      console.log("Error fetching businesses with loans:", e);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <FlatList
        data={businesses}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <LoanBusinessCard
            business={item}
            // Optional: let card trigger a refresh after an action
            onRefresh={onRefresh}
          />
        )}
        contentContainerStyle={styles.container}
        ListEmptyComponent={
          !refreshing && (
            <View style={styles.noBusinessContainer}>
              <Text style={styles.noBusinessText}>
                No businesses with loans found.
              </Text>
            </View>
          )
        }
      />

      {/* Floating + Button -> open modal */}
      {!businessModalVisible && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setBusinessModalVisible(true)}
          activeOpacity={0.9}
        >
          <MaterialCommunityIcons
            name="plus"
            size={24}
            color={Colors.app.white}
          />
        </TouchableOpacity>
      )}

      {/* Debtor: Create Business modal */}
      {user?.data.investmentRole === "debtor" && (
        <CreateBusiness
          isVisible={businessModalVisible}
          onClose={() => setBusinessModalVisible(false)}
        />
      )}

      {/* Investor: Invest modal (show ALL filtered businesses so they can pick any) */}
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
  container: {
    paddingVertical: 10,
    paddingHorizontal: 12,
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
    width: 48,
    height: 48,
    backgroundColor: Colors.app.primary,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
});

export default BusinessesWithLoans;
