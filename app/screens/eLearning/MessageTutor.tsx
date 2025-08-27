import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
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

const CURRENT_USER_ID = "6887b57f960e3c142c076dd3"; // 👈 Replace with actual logged-in user id
const RECEIVER_ID = "6887b57f960e3c142c076dd3"; // 👈 You can get this dynamically

interface Message {
  _id: string;
  chatId: string;
  message: string;
  read: boolean;
  senderId: string;
  receiverId: string;
  sender: {
    name: string;
    profilePicture?: string | null;
  };
  receiver: {
    name: string;
    profilePicture?: string | null;
  };
  timestamp: string;
}

interface MessageTutorProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

type RootStackParamList = {};

type MessageTutorRouteProp = RouteProp<RootStackParamList>;

const MessageTutor: React.FC<MessageTutorProps> = ({ navigation }) => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const socketRef = useRef<any>(null);

  const route = useRoute<MessageTutorRouteProp>();

  let {
    receiverId,
  }: {
    receiverId: string;
  } = route.params ?? {};

  const userId = CURRENT_USER_ID;
  const chatId = [userId, receiverId].sort().join("_");

  useEffect(() => {
    initializeSocket(userId);
    const socket = getSocket();
    socketRef.current = socket;

    // 1. Register user
    socket.emit("registerUser", userId);
    console.log("[Socket] User registered:", userId);

    // 2. Fetch conversations (inbox)
    socket.emit("getConversations", userId);
    socket.on("conversationsList", (conversations) => {
      console.log("[Socket] Conversations List:", conversations);
    });
    socket.on("conversationsError", (error) => {
      console.error("[Socket] Conversations Error:", error.message);
    });

    // 3. Join chat room and fetch history
    socket.emit("joinRoom", chatId);
    console.log("[Socket] Joined room:", chatId);

    socket.emit("getChatHistory", chatId);

    socket.on("chatHistory", (messages) => {
      console.log("[Socket] Chat History:", messages);
      setChatMessages(messages);
      scrollToBottom();
    });
    socket.on("chatHistoryError", (err) => {
      console.error("[Socket] Chat History Error:", err.message);
    });

    // 4. Incoming messages
    socket.on("receiveMessage", (msg) => {
      console.log("[Socket] Received message:", msg);
      setChatMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    // 5. Global new message notification
    socket.on("newMessageNotification", (notification) => {
      console.log("[Socket] New message notification:", notification);
      // Optional: show badge, alert, or update inbox
    });

    // 6. Typing indicators
    socket.on("typing", ({ userId: typingUser }) => {
      if (typingUser !== userId) setIsTyping(true);
    });

    //7 stop typing
    socket.on("stopTyping", ({ userId: typingUser }) => {
      if (typingUser !== userId) setIsTyping(false);
    });

    // 8 receive messgae
    socket.on("receiveMessage", (msg: Message) => {
      console.log("[Socket] Received message:", msg);
      setChatMessages((prev) => [...prev, msg]);
      scrollToBottom();

      // Mark it as read if this user is the receiver
      if (msg.receiverId === userId && !msg.read) {
        socket.emit("markAsRead", { messageId: msg._id });
      }
    });

    // chat history
    socket.on("chatHistory", (messages: Message[]) => {
      console.log("[Socket] Chat History:", messages);
      setChatMessages(messages);
      scrollToBottom();

      //  Mark all unread messages sent to the current user as read
      messages.forEach((msg) => {
        if (msg.receiverId === userId && !msg.read) {
          socket.emit("markAsRead", { messageId: msg._id });
        }
      });
    });

    socket.on("messageRead", ({ messageId }: { messageId: string }) => {
      console.log("[Socket] Message read:", messageId);
      setChatMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, read: true } : msg
        )
      );
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("chatHistory");
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("newMessageNotification");
      socket.off("conversationsList");
      socket.off("conversationsError");
    };
  }, [chatId]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgPayload = {
      chatId,
      senderId: userId,
      receiverId,
      message,
    };

    console.log("[Socket] Sending message:", msgPayload);
    socketRef.current.emit("sendMessage", msgPayload);
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  chatContainer: {
    padding: 10,
    paddingBottom: 70, // leave space for input
  },
  messageList: {
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
  typing: {
    fontStyle: "italic",
    marginHorizontal: 15,
    marginBottom: 5,
    color: "#888",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: 100,
    backgroundColor: "#fff",
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#007aff",
    padding: 10,
    borderRadius: 20,
  },
});

export default MessageTutor;
