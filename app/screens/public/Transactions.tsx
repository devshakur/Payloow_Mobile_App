import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import AppText from "../../../components/custom/AppText";
import Screen from "../../../components/custom/Screen";
import List from "../../../components/custom/list/List";
import { Colors } from "../../../constants/Colors";
import payment from "../../api/payment";
import routes from "../../navigations/routes";

type RootStackParamList = {
  TransactionDetail: {
    transaction: TransactionRes;
  };
};

interface TransactionsProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

export interface TransactionRes {
  _id: string;
  user: string;
  type: string;
  methodType: string;
  amount: number;
  merchant: string;
  status: string;
  reference: string;
  narration: string;
  createdAt: string;
}

export interface TransResponse {
  success: number;
  data: TransactionRes[];
}

const Transactions: FunctionComponent<TransactionsProps> = ({ navigation }) => {
  const [transactions, setTransactions] = useState<TransactionRes[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = async () => {
    try {
      const response = await payment.getTransactions();
      const responseData = response.data as TransResponse;
      if (response.ok) setTransactions(responseData.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount: number) => `₦${amount.toLocaleString("en-NG")}`;

  return (
    <Screen>
      <View style={styles.header}>
        <MaterialCommunityIcons
          onPress={() => navigation.goBack()}
          size={30}
          name="arrow-left"
        />
        <AppText style={styles.title}>Transactions</AppText>
        <View></View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.contents}
      >
        <View style={styles.listings}>
          {transactions.length === 0 ? (
            <AppText>No transactions found</AppText>
          ) : (
            transactions.map((item) => (
              <List
                key={item._id}
                listStyle={{ marginVertical: 10 }}
                leftIcon={
                  <View style={styles.iconContainer}>
                    <AntDesign
                      name="arrowup"
                      size={25}
                      color={Colors.app.primary}
                    />
                  </View>
                }
                leftTopLabel={item.narration}
                leftTopLabelStyle={styles.topLabel}
                leftBottomContainer={
                  <View style={styles.bottomLabel}>
                    <AppText
                      style={{
                        fontSize: 12,
                        color:
                          item.status === "success"
                            ? Colors.app.success
                            : Colors.app.failed,
                      }}
                    >
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}{" "}
                    </AppText>
                    <AppText style={{ fontSize: 12 }}>
                      - {formatDate(item.createdAt)}
                    </AppText>
                  </View>
                }
                rightTopLabel={formatAmount(item.amount)}
                rightTopLabelStyle={styles.amount}
                onPress={() =>
                  navigation.navigate(routes.TRANSACTION_DETAIL, {
                    transaction: item,
                  })
                }
              />
            ))
          )}
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
    gap: 40,
    paddingVertical: 10,
    alignSelf: "center",
  },
  contents: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: -30,
    flexGrow: 1,
    width: "100%",
  },
  title: {
    fontWeight: "900",
    fontSize: 16,
  },
  listings: {
    backgroundColor: Colors.app.white,
    width: "95%",
    minHeight: "90%",
    marginVertical: 25,
    padding: 5,
    borderRadius: 10,
  },
  iconContainer: {
    backgroundColor: Colors.app.profile,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
  topLabel: {
    color: Colors.app.dark,
    fontWeight: "900",
    fontSize: 10,
    width: 120,
  },
  bottomLabel: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  amount: {
    color: Colors.app.dark,
    fontWeight: "900",
    fontSize: 12,
  },
});

export default Transactions;
