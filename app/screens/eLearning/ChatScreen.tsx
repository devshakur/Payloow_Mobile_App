import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getSocket, initializeSocket } from "../../utils/utils";

const USER_STUDENT = "6887a5ee14dbebf50145a9b8";
const USER_TUTOR = "6887b57f960e3c142c076dd3";

const ChatScreen = () => {
  const [isTutor, setIsTutor] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatId = [USER_STUDENT, USER_TUTOR].sort().join("_");
  const socketRef = useRef<any>(null);
  const flatListRef = useRef<FlatList>(null);

  console.log(chatMessages);

  const userId = isTutor ? USER_TUTOR : USER_STUDENT;
  const receiverId = isTutor ? USER_STUDENT : USER_TUTOR;

  useEffect(() => {
    initializeSocket(userId);
    const socket = getSocket();
    socketRef.current = socket;

    socket.emit("joinRoom", chatId);
    socket.emit("getChatHistory", chatId);

    socket.on("chatHistory", (messages) => {
      setChatMessages(messages);
      scrollToBottom();
    });

    socket.on("receiveMessage", (msg) => {
      setChatMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    socket.on("typing", ({ userId: typingUser }) => {
      if (typingUser !== userId) setIsTyping(true);
    });

    socket.on("stopTyping", ({ userId: typingUser }) => {
      if (typingUser !== userId) setIsTyping(false);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("chatHistory");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [isTutor]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socketRef.current.emit("sendMessage", {
      chatId,
      senderId: userId,
      receiverId,
      message,
    });

    setMessage("");
    Keyboard.dismiss();
    socketRef.current.emit("stopTyping", { chatId, userId });
  };

  const handleTyping = (text: string) => {
    setMessage(text);
    socketRef.current.emit("typing", { chatId, userId });

    setTimeout(() => {
      socketRef.current.emit("stopTyping", { chatId, userId });
    }, 3000);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <View style={styles.container}>
        {/* Chat Messages */}
        <FlatList
          ref={flatListRef}
          data={chatMessages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => {
            const isMine = item.senderId === userId;
            return (
              <View
                style={[
                  styles.messageBubble,
                  isMine ? styles.myMessage : styles.otherMessage,
                ]}
              >
                <Text style={styles.messageText}>{item.message}</Text>
              </View>
            );
          }}
          contentContainerStyle={styles.chatContainer}
          onContentSizeChange={scrollToBottom}
          style={styles.messageList}
        />

        {isTyping && <Text style={styles.typing}>Typing...</Text>}

        {/* Input Bar */}
        <View style={styles.inputRow}>
          <TextInput
            placeholder="Type a message"
            value={message}
            onChangeText={handleTyping}
            style={styles.input}
            multiline
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },

  chatContainer: {
    padding: 10,
    paddingBottom: 10,
  },

  messageList: {
    flex: 1,
  },

  inputRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  wrapper: {
    flex: 1,
  },

  messageBubble: {
    padding: 10,
    borderRadius: 16,
    marginVertical: 5,
    maxWidth: "70%",
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
    borderTopRightRadius: 0,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
  },

  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#0b93f6",
    padding: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
  typing: {
    fontStyle: "italic",
    color: "gray",
    paddingHorizontal: 10,
    marginBottom: 5,
  },
});
