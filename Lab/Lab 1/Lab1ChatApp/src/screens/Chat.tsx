import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { io, Socket } from "socket.io-client";

type Message = {
    id: string;
    text: string;
    username: string;
    type?: "system";
    createdAt: number;
};

export const ChatScreen = ({ route }: any) => {
    const username = route.params?.username || "Unknown";

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");

    const socketRef = useRef<Socket | null>(null);
    const listRef = useRef<FlatList>(null);

    useEffect(() => {
        const socket = io("http://10.0.2.2:3000");
        socketRef.current = socket;

        socket.emit("join", { username });

        socket.on("receive_message", (msg: Message) => {
            setMessages(prev => [msg, ...prev]);
        });

        socket.on("user_joined", ({ username }) => {
            const systemMsg: Message = {
                id: Date.now().toString(),
                text: `${username} joined`,
                username: "system",
                type: "system",
                createdAt: Date.now()
            };
            setMessages(prev => [systemMsg, ...prev]);
        });

        socket.on("user_left", ({ username }) => {
            const systemMsg: Message = {
                id: Date.now().toString(),
                text: `${username} left`,
                username: "system",
                type: "system",
                createdAt: Date.now()
            };
            setMessages(prev => [systemMsg, ...prev]);
        });

        socket.on("chat_history", (history: Message[]) => {
            const formatted = [...history].reverse();
            setMessages(formatted);
        });

        return () => {
            socket.disconnect();
        };
    }, [username]);

    useEffect(() => {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim() || !socketRef.current) return;

        const msg: Message = {
            id: `${Date.now()}-${Math.random()}`,
            text: input,
            username,
            createdAt: Date.now()
        };

        socketRef.current.emit("send_message", msg);

        setInput("");
    };

    const renderItem = ({ item }: { item: Message }) => {
        if (item.type === "system") {
            return (
                <Text style={styles.systemText}>{item.text}</Text>
            );
        }

        const isMe = item.username === username;

        return (
            <View style={isMe ? styles.sentWrapper : styles.receivedWrapper}>
                {!isMe && (
                    <Text style={styles.username}>{item.username}</Text>
                )}
                <View style={isMe ? styles.sentBubble : styles.receivedBubble}>
                    <Text style={isMe ? styles.sentText : styles.receivedText}>
                        {item.text}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <FlatList
                ref={listRef}
                data={messages}
                inverted
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 12 }}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    value={input}
                    onChangeText={setInput}
                    placeholder="Message..."
                    style={styles.input}
                />

                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Ionicons name="send" size={18} color="#fff" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e5ddd5",
    },
    systemText: {
        textAlign: "center",
        color: "#777",
        fontSize: 12,
        marginVertical: 6,
    },
    sentWrapper: {
        alignSelf: "flex-end",
        marginVertical: 4,
        maxWidth: "75%",
    },

    sentBubble: {
        backgroundColor: "#2e9e8f",
        padding: 10,
        borderRadius: 16,
        borderBottomRightRadius: 4,
    },

    sentText: {
        color: "#fff",
        fontSize: 14,
    },

    receivedWrapper: {
        alignSelf: "flex-start",
        marginVertical: 4,
        maxWidth: "75%",
    },

    receivedBubble: {
        backgroundColor: "#ffffff",
        padding: 10,
        borderRadius: 16,
        borderBottomLeftRadius: 4,
        elevation: 1,
    },

    receivedText: {
        color: "#000",
        fontSize: 14,
    },

    username: {
        fontSize: 11,
        fontWeight: "600",
        marginBottom: 2,
        color: "#555",
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderColor: "#ddd",
        backgroundColor: "#fff",
    },

    input: {
        flex: 1,
        backgroundColor: "#f0f0f0",
        borderRadius: 20,
        paddingHorizontal: 14,
        height: 40,
        fontSize: 14,
    },

    sendButton: {
        marginLeft: 8,
        backgroundColor: "#2e9e8f",
        padding: 10,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
});