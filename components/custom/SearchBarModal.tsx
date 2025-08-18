import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import React, { FunctionComponent, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SearchBarModalProps {
  visible?: boolean;
  onClose?: () => void;
}

const phones = [
  "iPhone 14",
  "Samsung Galaxy S23",
  "Google Pixel 7",
  "OnePlus 11",
  "Xiaomi Mi 13",
  "Sony Xperia 1 V",
  "Huawei P60",
  "Oppo Find X6",
];

const SearchBarModal: FunctionComponent<SearchBarModalProps> = ({
  visible,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPhones, setFilteredPhones] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<number | null>(null);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredPhones([]);
      return;
    }

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      setLoading(true);
      setTimeout(() => {
        const results = phones.filter((phone) =>
          phone.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPhones(results);
        setLoading(false);
      }, 500); // Simulate API call delay
    }, 2000); // 5 seconds typing delay before loading

    setTypingTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
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
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={filteredPhones}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={styles.phoneItem}>{item}</Text>
            )}
          />
        )}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
    marginBottom: 20,
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
  phoneItem: {
    fontSize: 18,
    paddingVertical: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  closeText: {
    color: "white",
    fontSize: 16,
  },
});

export default SearchBarModal;
