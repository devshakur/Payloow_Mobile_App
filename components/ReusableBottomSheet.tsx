import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export interface BottomSheetProps {
  title?: string;
  field1?: string;
  field2?: string;
  onCancel?: () => void;
  onContinue?: () => void;
}

export interface BottomSheetRef {
  open: () => void;
  close: () => void;
}

const ReusableBottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  (
    {
      title = "Please pick a field",
      field1 = "",
      field2 = "",
      onCancel,
      onContinue,
    },
    ref
  ) => {
    const bottomSheetRef = useRef<BottomSheet>(null);

    // Expose open/close methods to parent
    useImperativeHandle(ref, () => ({
      open: () => bottomSheetRef.current?.expand(),
      close: () => bottomSheetRef.current?.close(),
    }));

    return (
      <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={["40%"]}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.inputsContainer}>
            <TextInput style={styles.input} value={field1} editable={false} />
            <TextInput
              style={[styles.input, { marginTop: 12 }]}
              value={field2}
              editable={false}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                bottomSheetRef.current?.close();
                onCancel?.();
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.continueButton]}
              onPress={() => {
                bottomSheetRef.current?.close();
                onContinue?.();
              }}
            >
              <Text style={styles.continueText}>Continue</Text>
              <Feather
                name="arrow-right"
                size={16}
                color={Colors.app.white}
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    );
  }
);

export default ReusableBottomSheet;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 16 },
  inputsContainer: {},
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: Colors.app.gray,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.app.grayLight,
    color: Colors.app.dark,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
  },
  cancelButton: { backgroundColor: Colors.app.grayLight, marginRight: 8 },
  continueButton: { backgroundColor: Colors.app.primary, marginLeft: 8 },
  cancelText: { color: Colors.app.dark, fontWeight: "700", fontSize: 14 },
  continueText: { color: Colors.app.white, fontWeight: "700", fontSize: 14 },
});
