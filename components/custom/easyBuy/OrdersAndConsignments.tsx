import React, { FunctionComponent, useState } from "react";
import { StyleSheet, View } from "react-native";
import SearchBar from "../SearchBar";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import AppButton from "../AppButton";
import { Colors } from "@/constants/Colors";
import List from "../list/List";
import ButtonWithIcon from "../ButtonWithIcon";

interface OrdersAndConsignmentsProps {}

const generateTransactions = (type: string, count = 100) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `#${Math.floor(100000 + Math.random() * 900000)}`,
    date: "10th Dec, 2024",
    amount: `₦${(Math.random() * 500000).toFixed(2)}`,
    status: Math.random() > 0.5 ? "Delivered" : "Pending",
  }));
};

const OrdersAndConsignments: FunctionComponent = () => {
  const [type, setType] = useState("orders");
  const [orders] = useState(generateTransactions("orders"));
  const [consignments] = useState(generateTransactions("consignments"));
  const [currentPage, setCurrentPage] = useState(1);

  const transactions = type === "orders" ? orders : consignments;
  const itemsPerPage = 5;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const currentData = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const generatePageNumbers = (): (number | string)[] => {
    let pages: (number | string)[] = [];
    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);

    pages.push(1);
    if (startPage > 2) pages.push("...");

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

 
    return pages;
  };

  return (
    <View style={styles.container}>
      <View style={styles.btnContainer}>
        <AppButton
          titleStyle={[styles.titleStyle, { color: Colors.app.white }]}
          btnContainerStyle={[
            styles.btn,
            {
              backgroundColor:
                type === "orders" ? Colors.app.primary : Colors.app.white,
            },
          ]}
          title="Orders"
          onPress={() => {
            setType("orders");
            setCurrentPage(1);
          }}
        />
        <AppButton
          titleStyle={[styles.titleStyle, { color: Colors.app.black }]}
          btnContainerStyle={[
            styles.btn,
            {
              backgroundColor:
                type === "consignments" ? Colors.app.primary : Colors.app.white,
            },
          ]}
          title="Consignment"
          onPress={() => {
            setType("consignments");
            setCurrentPage(1);
          }}
        />
      </View>
      <View style={styles.searchAndMenu}>
        <SearchBar style={{ width: "80%" }} />
        <Entypo name="menu" size={24} color="black" />
      </View>
      <View style={styles.list}>
        {currentData.map((item) => (
          <List
            key={item.id}
            listStyle={{ padding: 10 }}
            leftTopLabel={item.id}
            leftBottomLabel={item.date}
            rightTopLabel={item.amount}
            rightTopLabelStyle={{ color: Colors.app.black }}
            rightBottomLabel={item.status}
            rightBottomLabelStyle={{
              color:
                item.status === "Delivered"
                  ? Colors.app.success
                  : Colors.app.failed,
            }}
          />
        ))}
        <View style={styles.pagination}>
          <View style={styles.leftPagination}>
            {generatePageNumbers().map((page, index) => (
              <AppButton
                key={index}
                btnContainerStyle={[
                  styles.leftPaginationBtn,
                  currentPage === page && {
                    backgroundColor: Colors.app.primary,
                  },
                ]}
                title={page.toString()}
                onPress={() => {
                  if (typeof page === "number") {
                    setCurrentPage(page);
                  }
                }}
              />
            ))}
          </View>

          <View style={styles.rightPagination}>
            <ButtonWithIcon
              btnContainerStyle={[
                styles.rightPaginationBtn,
                { opacity: currentPage === 1 ? 0.5 : 1 },
              ]}
              icon={
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={24}
                  color={Colors.app.white}
                />
              }
              onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            />
            <ButtonWithIcon
              btnContainerStyle={[
                styles.rightPaginationBtn,
                { opacity: currentPage === totalPages ? 0.5 : 1 },
              ]}
              icon={
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={Colors.app.white}
                />
              }
              onPress={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginVertical: 10,
  },
  titleStyle: {
    fontSize: 14,
    color: Colors.app.primary,
    fontWeight: "500",
    fontStyle: "normal",
    fontFamily: "DM Sans",
    lineHeight: 20,
  },
  btnContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
    width: "100%",
  },
  btn: {
    backgroundColor: Colors.app.white,
    width: "50%",
    color: Colors.app.white,
    height: 50,
    borderColor: Colors.app.white,
    borderWidth: 1,
    margin: 0,
    padding: 0,
  },
  searchAndMenu: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 35,
    width: "100%",
  },
  list: {
    width: "100%",
    height: "70%",
    backgroundColor: Colors.app.white,
    borderRadius: 5,
  },
  pagination: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
  },

  leftPagination: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 0,
  },
  rightPagination: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  leftPaginationBtn: {
    width: 24,
    height: 24,
    borderColor: Colors.app.primary,
    borderWidth: 1,
    margin: 0,
    padding: 1,
    borderRadius: 5,
  },
  leftPaginationTitle: {},
  rightPaginationTitle: {},
  rightPaginationBtn: {
    backgroundColor: Colors.app.primary,
    margin: 0,
    padding: 0,
  },
  paginationBtnTitle: {
    color: Colors.app.dark,
  },
});

export default OrdersAndConsignments;
