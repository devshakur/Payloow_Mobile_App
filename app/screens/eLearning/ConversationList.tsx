import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useUser } from "../../context/UserProvider";
import { getSocket, initializeSocket } from "../../utils/utils";

interface Conversation {
  chatId: string;
  lastMessage: string;
  unreadCount: number;
  sender: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  receiver: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
}

const ConversationList = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const navigation = useNavigation<any>();
  const { user, setUser } = useUser();
  const userId = user?.data._id;

  console.log(userId);

  useEffect(() => {
    initializeSocket("6887b57f960e3c142c076dd3");
    const socket = getSocket();

    console.log(socket);

    socket.emit("registerUser", userId);
    socket.emit("getConversations", userId);

    socket.on("conversationsList", (data: Conversation[]) => {
      console.log("[Socket] Conversations:", data);
      setConversations(data);
    });

    socket.on("conversationsError", (err) => {
      console.error("[Socket] Conversations Error:", err.message);
    });

    return () => {
      socket.off("conversationsList");
      socket.off("conversationsError");
    };
  }, []);

  const handleOpenChat = (conv: Conversation) => {
    const otherUser = conv.sender._id === userId ? conv.receiver : conv.sender;
    navigation.navigate("MessageTutor", {
      receiverId: otherUser._id,
      // receiverName: otherUser.name,
    });
  };

  return (
    <FlatList
      data={conversations}
      keyExtractor={(item) => item.chatId}
      renderItem={({ item }) => {
        const otherUser =
          item.sender._id === userId ? item.receiver : item.sender;
        return (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleOpenChat(item)}
          >
            <Text style={styles.name}>{otherUser.name}</Text>
            <Text style={styles.preview}>{item.lastMessage}</Text>
            {item.unreadCount > 0 && (
              <Text style={styles.unread}>{item.unreadCount}</Text>
            )}
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  preview: {
    fontSize: 14,
    color: "#555",
  },
  unread: {
    fontSize: 12,
    color: "#f00",
    fontWeight: "bold",
    marginTop: 4,
  },
});

export default ConversationList;
