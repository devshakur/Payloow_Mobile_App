import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import AppText from '../AppText';
import ErrorMessage from './ErrorMessage';

interface PickerItem {
  label: string;
  value: any;
  icon?: any;
}

interface AppFormSelectDropDownProps {
  items: PickerItem[];
  name: string;
  placeholder?: string;
  onSelectItem?: (value: any, label?: string) => void;
  style?: any;
}

const AppFormSelectDropDown: React.FC<AppFormSelectDropDownProps> = ({
  items,
  name,
  placeholder = "Select an option",
  onSelectItem,
  style,
}) => {
  const { setFieldValue, errors, touched, values } = useFormikContext<any>();
  const [isVisible, setIsVisible] = useState(false);
  const selectedValue = values?.[name];

  const selectedItem = items.find(item => item.value === selectedValue);
  const displayText = selectedItem ? selectedItem.label : placeholder;

  const handleSelect = (item: PickerItem) => {
    setFieldValue(name, item.value);
    setIsVisible(false);
    if (onSelectItem) {
      onSelectItem(item.value, item.label);
    }
  };

  const renderItem = ({ item }: { item: PickerItem }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleSelect(item)}
    >
      <AppText style={styles.itemText}>{item.label}</AppText>
      {selectedValue === item.value && (
        <MaterialCommunityIcons
          name="check"
          size={20}
          color={Colors.app.primary}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <View style={[styles.container, style]}>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setIsVisible(true)}
        >
          <AppText
            style={[
              styles.selectorText,
              !selectedItem && styles.placeholderText
            ]}
          >
            {displayText}
          </AppText>
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color={Colors.app.dark + "60"}
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.dropdown}>
            <View style={styles.header}>
              <AppText style={styles.headerText}>Select Option</AppText>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={Colors.app.dark}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value.toString()}
              renderItem={renderItem}
              style={styles.list}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {errors?.[name] && touched?.[name] && (
        <ErrorMessage
          error={typeof errors[name] === "string" ? errors[name] : undefined}
          visible
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.app.white,
    borderWidth: 1.5,
    borderColor: Colors.app.dark + "20",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectorText: {
    fontSize: 16,
    fontFamily: "DMSans-Regular",
    color: Colors.app.dark,
    flex: 1,
  },
  placeholderText: {
    color: Colors.app.dark + "60",
    fontFamily: "DMSans-Regular",
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dropdown: {
    backgroundColor: Colors.app.white,
    borderRadius: 16,
    width: '100%',
    maxHeight: '60%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.app.dark + "10",
  },
  headerText: {
    fontSize: 18,
    fontFamily: "DMSans-Bold",
    color: Colors.app.dark,
  },
  list: {
    maxHeight: 300,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.app.dark + "05",
  },
  itemText: {
    fontSize: 16,
    fontFamily: "DMSans-Regular",
    color: Colors.app.dark,
  },
});

export default AppFormSelectDropDown;
