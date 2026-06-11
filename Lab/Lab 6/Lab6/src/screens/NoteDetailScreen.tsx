import React, { useEffect, useState } from 'react';

import {
    Alert,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import FirebaseService from '../services/firebase';

const NoteDetailScreen = ({
    route,
    navigation,
}: any) => {
    const { noteId } = route.params;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [color, setColor] = useState('#F7ECA3');
    const [menuVisible, setMenuVisible] =
        useState(false);

    useEffect(() => {
        const unsubscribe =
            FirebaseService.getNoteById(
                noteId,
                note => {
                    if (note) {
                        setTitle(note.title);
                        setContent(note.content);
                        setColor(note.color);
                    }
                },
            );

        return unsubscribe;
    }, [noteId]);

    const saveNote = async () => {
        try {
            await FirebaseService.updateNote(
                noteId,
                title,
                content,
            );

            setMenuVisible(false);
            navigation.goBack();
        } catch (error) {
            showError('Save failed', error);
        }
    };

    const deleteNote = async () => {
        setMenuVisible(false);

        Alert.alert(
            'Delete Note',
            'Are you sure you want to delete this note?',
            [
                {
                    text: 'No',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await FirebaseService.deleteNote(
                                noteId,
                            );

                            navigation.goBack();
                        } catch (error) {
                            showError(
                                'Delete failed',
                                error,
                            );
                        }
                    },
                },
            ],
        );
    };

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: color },
            ]}
        >
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.icon}>{'<'}</Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Edit Note
                </Text>

                <TouchableOpacity
                    onPress={() =>
                        setMenuVisible(true)
                    }
                >
                    <Text style={styles.menuIcon}>...</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                style={styles.titleInput}
            />

            <TextInput
                placeholder="Write your note..."
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
                style={styles.contentInput}
            />

            <Modal
                transparent
                visible={menuVisible}
                animationType="fade"
            >
                <Pressable
                    style={styles.overlay}
                    onPress={() =>
                        setMenuVisible(false)
                    }
                >
                    <View style={styles.menuContainer}>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={saveNote}
                        >
                            <Text
                                style={styles.menuText}
                            >
                                Save
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={deleteNote}
                        >
                            <Text
                                style={[
                                    styles.menuText,
                                    styles.deleteText,
                                ]}
                            >
                                Delete
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const showError = (title: string, error: unknown) => {
    const message =
        error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.';

    Alert.alert(title, message);
};

export default NoteDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        paddingHorizontal: 20,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },

    icon: {
        fontSize: 28,
    },

    menuIcon: {
        fontSize: 28,
        fontWeight: '700',
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },

    titleInput: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 20,
        color: '#333',
    },

    contentInput: {
        flex: 1,
        fontSize: 18,
        lineHeight: 28,
        color: '#555',
    },

    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: 70,
        paddingRight: 20,
    },

    menuContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        width: 140,
        overflow: 'hidden',
        elevation: 5,
    },

    menuItem: {
        paddingVertical: 14,
        paddingHorizontal: 16,
    },

    menuText: {
        fontSize: 16,
        fontWeight: '500',
    },

    deleteText: {
        color: 'red',
    },
});
