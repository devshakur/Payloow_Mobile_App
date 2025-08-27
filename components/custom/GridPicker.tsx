import { Colors } from "@/constants/Colors";
import React, { FunctionComponent } from "react";
import {
  FlatList,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import AppText from "./AppText";

interface GridPickerProps {
  amounts: any;
  containerStyle?: StyleProp<ViewStyle>;
  itemStyle?: any;
  returnValue?: (item: string) => void;
}

const GridPicker: FunctionComponent<GridPickerProps> = ({
  amounts,
  containerStyle,
  itemStyle,
  returnValue,
}) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={amounts}
        keyExtractor={(item) => item.toString()}
        numColumns={5}
        columnWrapperStyle={[
          {
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          },
          containerStyle,
        ]}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => returnValue?.(item)}
            style={[styles.item, itemStyle]}
          >
            <AppText style={styles.text}>{item}</AppText>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    margin: 5,
  },
  item: {
    backgroundColor: Colors.app.white,
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: Colors.app.primary,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 55,
    height: 40,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    fontFamily: "DM Sans",
    color: Colors.app.black,
  },
});

export default GridPicker;
