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
          {/* Profile Header */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              {profile.tutorImage ? (
                <Image
                  source={{ uri: profile.tutorImage }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.placeholderAvatar}>
                  <AppText style={styles.avatarText}>
                    {profile.tutorName
                      ? profile.tutorName.charAt(0).toUpperCase()
                      : "T"}
                  </AppText>
                </View>
              )}
            </View>

            <AppText style={styles.name}>{profile.tutorName}</AppText>
            <AppText style={styles.verified}>
              {profile.isVerified ? "✅ Verified Tutor" : "❌ Not Verified"}
            </AppText>
          </View>

          {/* About */}
          <AppText style={styles.about}>{profile.tutorAbout}</AppText>

          {/* Info Rows */}
          <View style={styles.infoRow}>
            <AppText style={styles.label}>Email</AppText>
            <AppText style={styles.value}>{profile.tutorEmail}</AppText>
          </View>
          <View style={styles.infoRow}>
            <AppText style={styles.label}>Phone</AppText>
            <AppText style={styles.value}>{profile.tutorPhone}</AppText>
          </View>
          <View style={styles.infoRow}>
            <AppText style={styles.label}>Qualification</AppText>
            <AppText style={styles.value}>{profile.tutorQualification}</AppText>
          </View>
          <View style={styles.infoRow}>
            <AppText style={styles.label}>Experience</AppText>
            <AppText style={styles.value}>{profile.tutorExperience}</AppText>
          </View>
          <View style={styles.infoRow}>
            <AppText style={styles.label}>Achievements</AppText>
            <AppText style={styles.value}>{profile.tutorAchievements}</AppText>
          </View>

          {/* Social Links */}
          <View style={styles.socials}>
            {profile.tutorFacebook ? (
              <AppText style={styles.socialLink}>🌐 Facebook</AppText>
            ) : null}
            {profile.tutorTwitter ? (
              <AppText style={styles.socialLink}>🐦 Twitter</AppText>
            ) : null}
            {profile.tutorLinkedIn ? (
              <AppText style={styles.socialLink}>💼 LinkedIn</AppText>
            ) : null}
            {profile.tutorInstagram ? (
              <AppText style={styles.socialLink}>📸 Instagram</AppText>
            ) : null}
          </View>

          {/* Date */}
          <AppText style={styles.date}>
            Joined on {new Date(profile.createdAt).toLocaleDateString()}
          </AppText>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.app.primary,
    backgroundColor: Colors.app.light, // fallback bg
  },
  placeholderAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.app.primary + "33", // light shade of primary
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    color: Colors.app.primary,
    fontFamily: "DM Sans",
  },

  card: {
    backgroundColor: Colors.app.white,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    width: "100%",
    maxWidth: 420,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: Colors.app.primary,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.app.primary,
    marginBottom: 6,
    fontFamily: "DM Sans",
  },
  verified: {
    fontSize: 14,
    color: Colors.app.success,
    fontWeight: "600",
  },
  about: {
    fontSize: 16,
    color: Colors.app.dark,
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 22,
    fontFamily: "Nunito",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
    width: "100%",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.app.light,
    paddingBottom: 6,
  },
  label: {
    fontWeight: "600",
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
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 8,
    gap: 10,
  },
  socialLink: {
    backgroundColor: Colors.app.primary,
    color: Colors.app.white,
    fontWeight: "600",
    fontSize: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    overflow: "hidden",
  },
  date: {
    marginTop: 18,
    color: Colors.app.light,
    fontSize: 13,
    fontFamily: "Nunito",
    fontStyle: "italic",
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
