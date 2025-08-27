import easyBuy from "@/app/api/easyBuy";
import useAuth from "@/app/auth/useAuth";
import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Product,
  ProductResponseData,
} from "../../../app/screens/easyBuy/buyer/BuyerDashboard";
import Cart from "./Cart";

interface SearchProductModalProps {
  visible?: boolean;
  onClose?: () => void;
  handleCardSelect: (product: Product) => void;
  navigation?: any;
}

const SearchProductModal: FunctionComponent<SearchProductModalProps> = ({
  visible,
  onClose,
  handleCardSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const { logOut } = useAuth();
  const [typingTimeout, setTypingTimeout] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const result = await easyBuy.getProducts();
      const data = result.data as ProductResponseData;
      if (result.ok) {
        setProducts(data.data.data);
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (error) {
      logOut();
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    Promise.all([fetchData()]).finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  // Filter logic
  useEffect(() => {
    if (searchQuery === "") {
      setFiltered([]);
      return;
    }

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(async () => {
      const results = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFiltered(results);

      setRefreshing(false);
    }, 1000);

    setTypingTimeout(timeout as unknown as number);

    return () => clearTimeout(timeout);
  }, [searchQuery, products]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Modal visible={visible} animationType="slide" transparent={false}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.searchContainer}>
            <Feather
              name="search"
              size={24}
              color={Colors.app.dark}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Search for a phone..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(item) => item._id.toString()}
            numColumns={2}
            renderItem={({ item }) => (
              <Cart
                product={item}
                handleSelect={() => handleCardSelect(item)}
              />
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
          />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.app.white,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  loader: {
    marginVertical: 20,
  },
  closeButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  closeText: {
    color: "white",
    fontSize: 16,
  },
});

export default SearchProductModal;
