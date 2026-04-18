import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useState } from "react";

export const LoginScreen = () => {
    const navigation = useNavigation<any>();

    const [username, setUsername] = useState("");

    const handleStartChat = async () => {
        if (!username.trim()) return;

        navigation.navigate('Chat', { username });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Your name</Text>
                <Text>Please enter your name to start a new chat</Text>
            </View>
            <View style={styles.main}>
                <Text style={styles.label}>Your name</Text>
                <TextInput
                    style={styles.usernameInput}
                    placeholder="Enter your name"
                    value={username}
                    onChangeText={setUsername}
                />
                <TouchableOpacity style={styles.button} onPress={handleStartChat}>
                    <Text style={styles.buttonText}>Start chat</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    header: {
        paddingVertical: 40,
        alignItems: 'center',
        gap: 32
    },
    main: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 16
    },
    label: {
        fontSize: 12,
        color: 'green',
    },
    usernameInput: {
        borderBottomWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        padding: 4,
        marginTop: 8,
    },
    button: {
        marginTop: 32,
        width: '80%',
        backgroundColor: 'green',
        padding: 8,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 'auto',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 24
    }
});