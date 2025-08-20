import React, { useEffect, useRef, useState } from "react";
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
// Updated import path after removing duplicate empty utils route file
import { getSocket } from "../../../../utils/utils";

const TUTOR_ID = "6887b57f960e3c142c076dd3"; // Your Tutor ID

export interface UserProfile {
  name: string;
  profilePicture: string | null;
}

export interface ChatMessage {
  __v: number;
  _id: string;
  chatId: string;
  message: string;
  read: boolean;
  receiver: UserProfile;
  receiverId: string;
  sender: UserProfile;
  senderId: string;
  timestamp: string; // Or Date if you're converting it with new Date()
}

const TutorChatScreen = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [receiverId, setReceiverId] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const flatListRef = useRef<FlatList>(null);

  const chatId = selectedChat?.chatId;

  const socket = getSocket();
  useEffect(() => {
    socket.emit("registerUser", TUTOR_ID);
    socket.emit("getConversations", TUTOR_ID);

    socket.on("conversationsList", (convos) => {
      setConversations(convos);
    });

    socket.on("chatHistory", (msgs) => {
      setChatMessages(msgs);
      setTimeout(() => scrollToBottom(), 300);
    });

    socket.on("newMessageNotification", (msg) => {
      if (msg.chatId === chatId && selectedChat?.receiverId) {
        setChatMessages((prev) => [...prev, msg]);
        scrollToBottom();
      }
    });

    socket.on("receiveMessage", (msg) => {
      if (msg.chatId === chatId) {
        setChatMessages((prev) => [...prev, msg]);
        scrollToBottom();
      }
    });

    return () => {
      socket.off("conversationsList");
      socket.off("chatHistory");
      socket.off("newMessageNotification");
      socket.off("receiveMessage");
    };
  }, [chatId]);

  const handleSelectChat = (conv: any) => {
    const isSender = conv.lastMessage.senderId === TUTOR_ID;
    const otherUser = isSender ? conv.receiver : conv.sender;

    setSelectedChat({
      chatId: conv.chatId,
      receiverId: isSender
        ? conv.lastMessage.receiverId
        : conv.lastMessage.senderId,
      name: otherUser?.name ?? "Unknown",
      profilePicture: otherUser?.profilePicture ?? null,
    });
    setReceiverId(
      isSender ? conv.lastMessage.receiverId : conv.lastMessage.senderId
    );

    socket.emit("joinRoom", conv.chatId);
    socket.emit("getChatHistory", conv.chatId);
  };

  const sendMessage = () => {
    if (!message.trim() || !receiverId) return;

    socket.emit("sendMessage", {
      chatId,
      senderId: TUTOR_ID,
      receiverId,
      message,
    });

    setMessage("");
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMyMessage = item.senderId === TUTOR_ID;
    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {!selectedChat ? (
        <View style={styles.inbox}>
          <Text style={styles.inboxTitle}>Inbox</Text>
          {conversations.map((conv, index) => {
            const otherUser =
              conv.senderId === TUTOR_ID ? conv.receiver : conv.sender;
            return (
              <TouchableOpacity
                key={index}
                style={styles.inboxItem}
                onPress={() => handleSelectChat(conv)}
              >
                <View style={styles.userRow}>
                  {otherUser.profilePicture ? (
                    <Image
                      source={{ uri: otherUser.profilePicture }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View style={[styles.avatar, styles.placeholderAvatar]}>
                      <Text style={{ color: "#fff" }}>
                        {otherUser.name.charAt(0)}
                      </Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inboxUser}>{otherUser.name}</Text>
                    <Text numberOfLines={1} style={styles.inboxMessage}>
                      {typeof conv.lastMessage === "object"
                        ? conv.lastMessage.message
                        : conv.lastMessage}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={80}
        >
          <FlatList
            ref={flatListRef}
            data={chatMessages}
            renderItem={renderMessage}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={styles.chat}
          />
          <View style={styles.inputContainer}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              style={styles.input}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  inbox: {
    padding: 16,
  },
  inboxTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  inboxItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  placeholderAvatar: {
    backgroundColor: "#888",
    justifyContent: "center",
    alignItems: "center",
  },
  inboxUser: {
    fontWeight: "bold",
    fontSize: 16,
  },
  inboxMessage: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  chat: {
    padding: 12,
    paddingBottom: 80,
  },
  messageContainer: {
    maxWidth: "70%",
    borderRadius: 20,
    padding: 10,
    marginVertical: 4,
  },
  myMessage: {
    backgroundColor: "#dcf8c6",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  theirMessage: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#128C7E",
    borderRadius: 20,
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default TutorChatScreen;
