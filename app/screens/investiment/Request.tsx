import RepayHeader from "@/components/custom/investiment/RepayHeader";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import BusinessCard from "../../../components/custom/investiment/BusinessCard";
import Screen from "../../../components/custom/Screen";
import { Colors } from "../../../constants/Colors";
import investment from "../../api/investment";
import { useUser } from "../../context/UserProvider";

export interface InvestmentApiResponse {
  success: boolean;
  investments: Investment[];
}

export interface Investment {
  id: string;
  business: Business;
  investor: Investor;
  amount: number;
  expectedRoi: number;
  paymentTerm: number;
  paymentFrequency: string;
  dueDate: string;
  disbursed: number;
  remaining: number;
  status: string;
  debtorId: string;
  debtorUserId: string;
  repaymentSchedule: RepaymentSchedule[];
}

export interface Business {
  _id: string;
  debtor: string;
  user: string;
  business_name: string;
  business_description: string;
  business_stage: string;
  customer_model: string;
  industry: string[];
  website?: string;
  twitter_url?: string;
  linkedIn_url?: string;
  facebook_url?: string;
  youTube_url?: string;
  instagram_url?: string;
  tikTok_url?: string;
  financial_statements: string[];
  growth_plans: string[];
  loan_requirements: string[];
  isOpen: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  loan: Loan;
}

export interface RepaymentSchedule {
  _id: string;
  installment: number;
  amount: { $numberDecimal: string };
  dueDate: string;
  status: string;
  paidAt: string;
}

export interface Loan {
  loan_amount: number;
  collateral: string;
  credit_score: number;
  status: string;
  amount_disbursed: number;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Investor {
  totalInvestment?: { $numberDecimal: string };
  totalReturns?: { $numberDecimal: string };
  netProfits?: { $numberDecimal: string };
  repaymentsTOBeRedeemed?: { $numberDecimal: string };
  _id: string;
  user: string;
  contactEmail: string;
  contactPhoneNumber: string;
  isInvestorVerified: boolean;
  industry: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

type RootStackParamList = {};

interface RequestProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

interface Response {
  error?: string;
  message?: string;
}

const Request: FunctionComponent<RequestProps> = ({ navigation }) => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useUser();

  const fetchInvestments = async () => {
    try {
      setRefreshing(true);
      let response;
      if (user?.data.investmentRole === "investor") {
        response = await investment.getInvestmentsByInvestor();
      } else if (user?.data.investmentRole === "debtor") {
        response = await investment.getInvestmentsByDebtor();
      }

      const data = response?.data as InvestmentApiResponse;
      if (response?.ok) {
        setInvestments(data.investments || []);
      }
    } catch (error) {
      console.error("Failed to fetch investments:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    Promise.all([fetchInvestments()]).finally(() => setRefreshing(false));
  }, [user]);

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <RepayHeader />
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={investments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BusinessCard
            showApprovalButtons={item.status === "pending"}
            business={item.business}
            repaymentSchedule={item.repaymentSchedule}
            showRepaymentDropdown={item.status === "accepted"}
            investmentId={item.id}
            onLoading={(val) =>
              val === true ? setRefreshing(true) : setRefreshing(false)
            }
          />
        )}
        contentContainerStyle={styles.container}
        ListEmptyComponent={
          <View style={styles.noBusinessContainer}>
            <Text style={styles.noBusinessText}>
              No Repayment for businesses Scheduled for Now.
            </Text>
          </View>
        }
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: Colors.app.screen,
    minHeight: "100%",
  },
  noBusinessContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  noBusinessText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.app.screen,
  },
});

export default Request;
