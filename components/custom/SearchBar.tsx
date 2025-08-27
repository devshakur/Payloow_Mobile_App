import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "./AppText";

interface SearchBarProps {
  onPress?: () => void;
  style?: any;
}

const SearchBar: React.FC<SearchBarProps> = ({ onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.searchBar, style]}>
      <Feather name="search" size={20} color={Colors.app.white} />
      <View>
        <AppText style={styles.searchText}>Search...</AppText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    height: 50,
    width: "90%",
    backgroundColor: "#1E293B", // cool gray
    paddingHorizontal: 15,
    elevation: 4, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#fff", // white text
  },
  icon: {
    marginRight: 8,
  },

  searchText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "400",
    color: Colors.app.white, // white text for contrast
  },
});

export default SearchBar;
