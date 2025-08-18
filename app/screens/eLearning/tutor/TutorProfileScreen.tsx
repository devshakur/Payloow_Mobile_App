import AppText from "@/components/custom/AppText";
import { Colors } from "@/constants/Colors";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Screen from "../../../../components/custom/Screen";
import elearning from "../../../api/elearning";

interface TutorProfileResponse {
  tutor: {
    id: string;
    tutorName: string;
    tutorEmail: string;
    tutorPhone: string;
    tutorAbout: string;
    tutorImage: string;
    tutorQualification: string;
    tutorExperience: string;
    tutorAchievements: string;
    tutorFacebook: string;
    tutorTwitter: string;
    tutorLinkedIn: string;
    tutorInstagram: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

const TutorProfileScreen: React.FC = () => {
  const [profile, setProfile] = useState<TutorProfileResponse["tutor"] | null>(
    null
  );
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const response = (await elearning.getTutorProfile())
        .data as TutorProfileResponse;

    
      setProfile(response.tutor);
    } catch (error) {
      console.error("Failed to fetch the tutor profile:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([fetchData()]).finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  if (!profile) {
    return (
      <View style={styles.centered}>
        <AppText style={styles.errorText}>Tutor profile not found.</AppText>
      </View>
    );
  }

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.container}
      >
        <View style={styles.card}>
          <Image source={{ uri: profile.tutorImage }} style={styles.avatar} />
          <AppText style={styles.name}>{profile.tutorName}</AppText>
          <AppText style={styles.verified}>
            {profile.isVerified ? "Verified Tutor" : "Not Verified"}
          </AppText>
          <AppText style={styles.about}>{profile.tutorAbout}</AppText>
          <View style={styles.infoRow}>
            <AppText style={styles.label}>Email:</AppText>
            <AppText style={styles.value}>{profile.tutorEmail}</AppText>
          </View>
          <View style={styles.infoRow}>
            <AppText style={styles.label}>Phone:</AppText>
            <AppText style={styles.value}>{profile.tutorPhone}</AppText>
          </View>
          <View style={styles.infoRow}>
            <AppText style={styles.label}>Qualification:</AppText>
            <AppText style={styles.value}>{profile.tutorQualification}</AppText>
          </View>
          <View style={styles.infoRow}>
            <AppText style={styles.label}>Experience:</AppText>
            <AppText style={styles.value}>{profile.tutorExperience}</AppText>
          </View>
          <View style={styles.infoRow}>
            <AppText style={styles.label}>Achievements:</AppText>
            <AppText style={styles.value}>{profile.tutorAchievements}</AppText>
          </View>
          <View style={styles.socials}>
            {profile.tutorFacebook ? (
              <AppText style={styles.socialLink}>Facebook</AppText>
            ) : null}
            {profile.tutorTwitter ? (
              <AppText style={styles.socialLink}>Twitter</AppText>
            ) : null}
            {profile.tutorLinkedIn ? (
              <AppText style={styles.socialLink}>LinkedIn</AppText>
            ) : null}
            {profile.tutorInstagram ? (
              <AppText style={styles.socialLink}>Instagram</AppText>
            ) : null}
          </View>
          <AppText style={styles.date}>
            Joined: {new Date(profile.createdAt).toLocaleDateString()}
          </AppText>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: Colors.app.screen,
    alignItems: "center",
  },
  card: {
    backgroundColor: Colors.app.white,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    width: "100%",
    maxWidth: 400,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.app.primary,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.app.primary,
    marginBottom: 4,
    fontFamily: "DM Sans",
  },
  verified: {
    fontSize: 14,
    color: Colors.app.success,
    marginBottom: 12,
    fontWeight: "600",
  },
  about: {
    fontSize: 16,
    color: Colors.app.dark,
    marginBottom: 16,
    textAlign: "center",
    fontFamily: "Nunito",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
    width: "100%",
    justifyContent: "space-between",
  },
  label: {
    fontWeight: "bold",
    color: Colors.app.primary,
    fontSize: 15,
    fontFamily: "DM Sans",
  },
  value: {
    color: Colors.app.black,
    fontSize: 15,
    fontFamily: "Nunito",
    flex: 1,
    textAlign: "right",
    marginLeft: 8,
  },
  socials: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  socialLink: {
    color: Colors.app.primary,
    fontWeight: "bold",
    fontSize: 15,
    textDecorationLine: "underline",
    marginHorizontal: 4,
  },
  date: {
    marginTop: 12,
    color: Colors.app.light,
    fontSize: 13,
    fontFamily: "Nunito",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.app.screen,
  },
  errorText: {
    color: Colors.app.failed,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TutorProfileScreen;
