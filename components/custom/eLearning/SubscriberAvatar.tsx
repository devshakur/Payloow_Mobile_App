import { Image, StyleSheet, Text, View } from "react-native";

const subscribers = [
  { id: 1, avatar: "https://i.pravatar.cc/100?img=1" },
  { id: 2, avatar: "https://i.pravatar.cc/100?img=2" },
  { id: 3, avatar: "https://i.pravatar.cc/100?img=3" },
  { id: 4, avatar: "https://i.pravatar.cc/100?img=4" },
];

export default function SubscriberAvatars({ enrolled }: { enrolled: number }) {
  return (
    <View style={styles.row}>
      {subscribers.slice(0, 3).map((sub, index) => (
        <Image
          key={sub.id}
          source={{ uri: sub.avatar }}
          style={[styles.avatar, { marginLeft: index === 0 ? 0 : -15 }]}
        />
      ))}
      <View style={[styles.avatar, styles.more]}>
        <Text style={{ color: "#007bff", fontWeight: "bold" }}>
          +{enrolled}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  more: {
    backgroundColor: "#DBE7FE",
    justifyContent: "center",
    alignItems: "center",
  },
});
