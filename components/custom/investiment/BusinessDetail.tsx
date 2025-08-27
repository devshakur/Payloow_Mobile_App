// screens/BusinessDetail.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Business } from "../../../app/screens/investiment/Request";
import { Colors } from "../../../constants/Colors";
import Screen from "../Screen";

type RootStackParamList = {
  BusinessDetail: { business: Business };
};

interface Props {
  images: string[];
}

const HorizontalImageScroll = ({ images }: Props) => {
  if (!images || images.length === 0) return null;
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {images.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
    </View>
  );
};

const openLink = async (url: string) => {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  }
};

const BusinessDetail = () => {
  const route = useRoute<RouteProp<RootStackParamList, "BusinessDetail">>();
  const { business } = route.params;

  return (
    <Screen backgroundColor={Colors.app.white}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{business.business_name}</Text>
        <Text style={styles.desc}>{business.business_description}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Stage:</Text>
          <Text style={styles.value}>{business.business_stage}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Model:</Text>
          <Text style={styles.value}>{business.customer_model}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Industries:</Text>
          <Text style={styles.value}>{business.industry.join(", ")}</Text>
        </View>

        {business.loan && (
          <View style={styles.loanContainer}>
            <Text style={styles.loanTitle}>Loan Details</Text>
            <Text style={styles.loanValue}>
              Amount: ₦{business.loan.loan_amount}
            </Text>
            <Text style={styles.loanValue}>
              Collateral: {business.loan.collateral}
            </Text>
            <Text style={styles.loanValue}>
              Credit Score: {business.loan.credit_score}
            </Text>
            <Text style={styles.loanValue}>Status: {business.loan.status}</Text>
            <Text style={styles.loanValue}>
              Amount Disbursed: ₦{business.loan.amount_disbursed}
            </Text>
          </View>
        )}

        <View style={styles.socialLinks}>
          {business.website && (
            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => openLink(business.website || "")}
            >
              <MaterialCommunityIcons name="web" size={20} />
              <Text style={styles.linkText}>Website</Text>
            </TouchableOpacity>
          )}
          {business.twitter_url && (
            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => openLink(business.twitter_url || "")}
            >
              <MaterialCommunityIcons
                name="twitter"
                size={20}
                color="#1DA1F2"
              />
              <Text style={styles.linkText}>Twitter</Text>
            </TouchableOpacity>
          )}
          {business.linkedIn_url && (
            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => openLink(business.linkedIn_url || "")}
            >
              <MaterialCommunityIcons
                name="linkedin"
                size={20}
                color="#0077B5"
              />
              <Text style={styles.linkText}>LinkedIn</Text>
            </TouchableOpacity>
          )}
          {business.facebook_url && (
            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => openLink(business.facebook_url || "")}
            >
              <MaterialCommunityIcons
                name="facebook"
                size={20}
                color="#1877F2"
              />
              <Text style={styles.linkText}>Facebook</Text>
            </TouchableOpacity>
          )}
          {business.youTube_url && (
            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => openLink(business.youTube_url || "")}
            >
              <MaterialCommunityIcons
                name="youtube"
                size={20}
                color="#FF0000"
              />
              <Text style={styles.linkText}>YouTube</Text>
            </TouchableOpacity>
          )}
          {business.instagram_url && (
            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => openLink(business.instagram_url || "")}
            >
              <MaterialCommunityIcons
                name="instagram"
                size={20}
                color="#C13584"
              />
              <Text style={styles.linkText}>Instagram</Text>
            </TouchableOpacity>
          )}
          {business.tikTok_url && (
            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => openLink(business.tikTok_url || "")}
            >
              <MaterialCommunityIcons
                name="music-note"
                size={20}
                color="#000"
              />
              <Text style={styles.linkText}>TikTok</Text>
            </TouchableOpacity>
          )}
        </View>

        <HorizontalImageScroll
          images={[
            business.financial_statements[0],
            business.growth_plans[0],
            business.loan_requirements[0],
          ].filter(Boolean)}
        />

        {business.growth_plans.length > 0 && (
          <View style={styles.fileSection}>
            <Text style={styles.fileTitle}>Growth Plans</Text>
            {business.growth_plans.map((url, idx) => (
              <Text
                key={idx}
                style={styles.fileLink}
                onPress={() => openLink(url)}
              >
                View File {idx + 1}
              </Text>
            ))}
          </View>
        )}

        {business.loan_requirements.length > 0 && (
          <View style={styles.fileSection}>
            <Text style={styles.fileTitle}>Loan Requirements</Text>
            {business.loan_requirements.map((url, idx) => (
              <Text
                key={idx}
                style={styles.fileLink}
                onPress={() => openLink(url)}
              >
                View File {idx + 1}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
};

export default BusinessDetail;

const styles = StyleSheet.create({
  container: {
    padding: 22,
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
    textAlign: "center",
  },
  desc: {
    fontSize: 15,
    color: "#444",
    marginBottom: 12,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginRight: 6,
  },
  value: {
    fontSize: 15,
    fontWeight: "400",
    color: "#555",
  },
  loanContainer: {
    marginTop: 14,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  loanTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
    color: "#222",
  },
  loanValue: {
    fontSize: 14,
    color: "#444",
    marginBottom: 2,
  },
  socialLinks: {
    marginTop: 14,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  linkText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  fileSection: {
    marginTop: 16,
  },
  fileTitle: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 4,
    color: "#222",
  },
  fileLink: {
    fontSize: 14,
    color: "#007bff",
    textDecorationLine: "underline",
    marginTop: 2,
  },
  scrollContainer: {
    gap: 10,
    paddingHorizontal: 10,
  },
  image: {
    width: 150,
    height: 120,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
});
