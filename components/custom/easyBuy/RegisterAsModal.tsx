import React, { FunctionComponent } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Button, Dialog, Portal, Text, useTheme } from "react-native-paper";
import { Product } from "../../../app/screens/easyBuy/buyer/BuyerDashboard";

interface RoleSelectDialogProps {
  visible: boolean;
  role: "buyer" | "partner" | null;
  selectedProduct: Product | null;
  onDismiss: () => void;
  onSelectRole: (role: "buyer" | "partner") => void;
  onContinue: (role: "buyer" | "partner", product: Product) => void;
}

const RegisterAsModal: FunctionComponent<RoleSelectDialogProps> = ({
  visible,
  role,
  selectedProduct,
  onDismiss,
  onSelectRole,
  onContinue,
}) => {
  const theme = useTheme();

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title>Select Role</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.subtitle}>
            Choose whether you are registering as a buyer or a partner
          </Text>

          {/* Buyer Option */}
          <TouchableOpacity
            style={[
              styles.option,
              role === "buyer" && { borderColor: theme.colors.primary },
            ]}
            onPress={() => onSelectRole("buyer")}
          >
            <Text style={styles.optionText}>Buyer</Text>
          </TouchableOpacity>

          {/* Partner Option */}
          <TouchableOpacity
            style={[
              styles.option,
              role === "partner" && { borderColor: theme.colors.primary },
            ]}
            onPress={() => onSelectRole("partner")}
          >
            <Text style={styles.optionText}>Partner</Text>
          </TouchableOpacity>
        </Dialog.Content>

        <Dialog.Actions style={styles.actions}>
          <Button onPress={onDismiss} textColor={theme.colors.error}>
            Cancel
          </Button>
          <Button
            mode="contained"
            disabled={!role || !selectedProduct}
            onPress={() => {
              if (role && selectedProduct) {
                onContinue(role, selectedProduct);
              }
            }}
          >
            Continue
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 12,
  },
  subtitle: {
    marginBottom: 16,
    fontSize: 14,
  },
  option: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 8,
    borderStyle: "dashed",
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
  },
  actions: {
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
});

export default RegisterAsModal;
