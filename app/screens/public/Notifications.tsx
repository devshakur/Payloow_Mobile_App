import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import List from "../../../components/custom/list/List";
import Screen from "../../../components/custom/Screen";
import { useUser } from "../../context/UserProvider";

const Notifications: React.FC = () => {
  const { user, setUser } = useUser();
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        {user?.data.notification.map((notification) => (
          <View key={notification._id} style={styles.item}>
            <List
              leftIcon={
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={24}
                  color={Colors.app.primary}
                />
              }
              leftLabel={notification.title}
              rightIcon={
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={Colors.app.black}
                />
              }
              onPress={() => alert(notification.body)}
            />
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    gap: 10,
  },
  item: {
    paddingHorizontal: 10,
  },
});

export default Notifications;
