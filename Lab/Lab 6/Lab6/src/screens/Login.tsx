import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


export const LoginScreen = () => {

    const handleLogin = () => {
        // Implement login logic here
    }



    return (
        <View style={style.container}>
            <Text style={style.title}>Login</Text>
            <Text style={style.label}>Username:</Text>
            <TextInput style={style.input} placeholder="Enter your username" />
            <Text style={style.label}>Password:</Text>
            <TextInput style={style.input} placeholder="Enter your password" secureTextEntry />

            <TouchableOpacity style={style.button} onPress={handleLogin}>
                <Text style={style.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    title: {
        fontSize: 24,
        fontWeight: '700',
    },

    label: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 20,
        width: '100%',
    },

    input: {
        backgroundColor: '#F3F3F3',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 20,
        width: '100%',
    },

    button: {
        backgroundColor: '#ff00c8f7',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
});