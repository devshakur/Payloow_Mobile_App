import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import AppText from "../../../components/custom/AppText";
import InvestmentCard from "../../../components/custom/investiment/InvestmentCard";
import Screen from "../../../components/custom/Screen";
import { Colors } from "../../../constants/Colors";
import investment from "../../api/investment";
import { useUser } from "../../context/UserProvider";

interface InvestmentResponse {
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

interface Business {
  _id: string;
  debtor: string;
  user: string;
  business_name: string;
  business_description: string;
  business_stage: string;
  customer_model: string;
  industry: string[];
  website: string;
  twitter_url: string;
  linkedIn_url: string;
  facebook_url: string;
  youTube_url: string;
  instagram_url: string;
  tikTok_url: string;
  financial_statements: any[]; // Adjust type if structure is known
  growth_plans: any[]; // Adjust type if structure is known
  loan_requirements: any[]; // Adjust type if structure is known
  isOpen: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  loan: Loan;
}

interface Loan {
  loan_amount: number;
  collateral: string;
  credit_score: number;
  status: string;
  amount_disbursed: number;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

interface Investor {
  _id: string;
  user: string;
  contactEmail: string;
  contactPhoneNumber: string;
  isInvestorVerified: boolean;
  industry: string[];
  totalInvestment: DecimalValue;
  totalReturns: DecimalValue;
  netProfits: DecimalValue;
  repaymentsTOBeRedeemed: DecimalValue;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface DecimalValue {
  $numberDecimal: string;
}

interface RepaymentSchedule {
  installment: number;
  amount: DecimalValue;
  dueDate: string;
  status: "pending" | "paid";
  paidAt: string | null;
  _id: string;
}

interface MyInvestimentProps {
  navigation: NativeStackNavigationProp<any>;
}

const MyInvestiment: FunctionComponent<MyInvestimentProps> = ({
  navigation,
}) => {
  const [investments, setInvestments] = useState<Investment[]>([]);

  const { user } = useUser();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    Promise.all([fetchInvestments()]).finally(() => {
      setRefreshing(false);
    });
  }, [user]);

  useEffect(() => {
    onRefresh();
  }, []);

  const fetchInvestments = async () => {
    try {
      setRefreshing(true);
      const response = await investment.getInvestmentsByInvestor();
      const data = response.data as { investments: Investment[] };
      setInvestments(data.investments);
    } catch (error) {
      console.error("Failed to fetch investments:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <AppText style={[styles.title, { margin: 10 }]}>My Investments</AppText>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={investments}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, id) => item.id}
        renderItem={({ item }) => <InvestmentCard investment={item} />}
        contentContainerStyle={{
          gap: 12,
          paddingHorizontal: 8,
          paddingBottom: 24,
        }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.app.primary,
    textAlign: "center",
  },
});

export default MyInvestiment;
