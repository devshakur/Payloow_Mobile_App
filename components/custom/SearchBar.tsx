import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import AppText from "./AppText";
import { Colors } from "@/constants/Colors";

interface SearchBarProps {
  onPress?: () => void;
  style?: any;
}

const SearchBar: React.FC<SearchBarProps> = ({ onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.searchBar, style]}>
      <Feather name="search" size={24} color={Colors.app.dark} />

      <View>
        <AppText style={styles.searchText}>Search...</AppText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  searchText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 8,
    height: 45,
    width: "90%",
    backgroundColor: Colors.app.white,
    padding: 10,
    borderColor: Colors.app.input,
    borderWidth: 1,
    gap: 10,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16 },
  item: { padding: 10, fontSize: 18 },
});

export default SearchBar;
