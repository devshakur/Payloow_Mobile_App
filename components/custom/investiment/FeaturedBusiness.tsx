import { Colors } from "@/constants/Colors";
import React, { FunctionComponent } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import routes from "../../../app/navigations/routes";
import { Business } from "../../../app/screens/investiment/Request";
import AppText from "../AppText";

interface FeaturedBusinessProps {
  navigation?: any;
  businesses: Business[];
}

// Small card component
const SmallBusinessCard = ({
  business,
  handleSelect,
}: {
  business: Business;
  handleSelect?: (business: Business) => void;
}) => (
  <TouchableOpacity
    style={smallCardStyles.card}
    onPress={() => handleSelect?.(business)}
  >
    <AppText style={smallCardStyles.title}>{business.business_name}</AppText>
    <AppText numberOfLines={2} style={smallCardStyles.desc}>
      {business.business_description}
    </AppText>
    <AppText style={smallCardStyles.stage}>
      Stage: {business.business_stage}
    </AppText>
    <AppText style={smallCardStyles.model}>
      Model: {business.customer_model}
    </AppText>
    <AppText numberOfLines={1} style={smallCardStyles.industry}>
      {business.industry.join(", ")}
    </AppText>
  </TouchableOpacity>
);

const smallCardStyles = StyleSheet.create({
  card: {
    height: 150,
    width: 200,
    padding: 12,
    borderRadius: 10,
    backgroundColor: Colors.app.white,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.app.dark,
  },
  desc: {
    fontSize: 12,
    color: Colors.app.light,
    marginVertical: 4,
  },
  industry: {
    fontSize: 12,
    color: Colors.app.success,
  },
  stage: {
    fontSize: 12,
    color: Colors.app.primary,
  },
  model: {
    fontSize: 12,
    color: Colors.app.primary,
  },
});

const FeaturedBusiness: FunctionComponent<FeaturedBusinessProps> = ({
  navigation,
  businesses,
}) => {
  const handleClick = (business: Business) => {
    Alert.alert(
      "Business Options",
      `What do you want to do with "${business.business_name}"?`,
      [
        {
          text: "View Details",
          onPress: () =>
            navigation?.navigate(routes.BUSINESS_DETAIL, { business }),
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={businesses}
        horizontal
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <SmallBusinessCard business={item} handleSelect={handleClick} />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.app.screen,
    gap: 2,
    width: "100%",
  },
});

export default FeaturedBusiness;
