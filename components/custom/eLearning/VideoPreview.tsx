import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface VideoPreviewProps {
  url: any;
  onPress: () => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ url, onPress }) => {
  const player = useVideoPlayer(url, (p) => {
    try {
      p.loop = false;
      p.muted = true;
      p.play(); // autoplay preview
    } catch (err) {
      console.warn("Video preview error:", err);
    }
  });

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        nativeControls={false}
        allowsFullscreen={true}
        showsTimecodes={false}
        allowsPictureInPicture={false}
      />
      <View style={styles.overlay}>
        <Ionicons name="play-circle" size={60} color="#fff" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#000",
    position: "relative",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
});

export default VideoPreview;
