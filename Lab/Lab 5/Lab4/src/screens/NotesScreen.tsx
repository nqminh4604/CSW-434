import React, { useEffect, useMemo, useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
} from 'react-native';

import FirebaseService from '../services/firebase';

import { Note } from '../types/Note';
import NoteCard from '../components/NoteCard';

const COLORS = [
    '#F7ECA3',
    '#A7F0BA',
    '#D9B8FF',
    '#FFB6C1',
    '#AEEBFF',
];

const NotesScreen = ({ navigation }: any) => {
    const [allNotes, setAllNotes] = useState<Note[]>([]);

    const [searchText, setSearchText] = useState('');

    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        const unsubscribe =
            FirebaseService.getAllNotes(setAllNotes);

        return unsubscribe;
    }, []);

    const filteredNotes = useMemo(() => {
        if (!searchText.trim()) {
            return allNotes;
        }

        const keyword = searchText.toLowerCase();

        return allNotes.filter(note => {
            const titleMatch =
                note.title
                    ?.toLowerCase()
                    .includes(keyword);

            const contentMatch =
                note.content
                    ?.toLowerCase()
                    .includes(keyword);

            return titleMatch || contentMatch;
        });
    }, [allNotes, searchText]);

    const createNote = async () => {
        const randomColor =
            COLORS[Math.floor(Math.random() * COLORS.length)];

        const noteId =
            await FirebaseService.createNote(
                randomColor,
            );

        navigation.navigate('NoteDetail', {
            noteId,
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.menu}>☰</Text>

                <Text style={styles.headerTitle}>
                    Recent Notes
                </Text>

                <TouchableOpacity
                    onPress={() =>
                        setShowSearch(!showSearch)
                    }
                >
                    <Text style={styles.search}>
                        ⌕
                    </Text>
                </TouchableOpacity>
            </View>

            {showSearch && (
                <TextInput
                    placeholder="Search notes..."
                    value={searchText}
                    onChangeText={setSearchText}
                    style={styles.searchInput}
                />
            )}

            <FlatList
                data={filteredNotes}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={{
                    justifyContent: 'space-between',
                }}
                contentContainerStyle={{
                    paddingBottom: 120,
                }}
                renderItem={({ item }) => (
                    <View style={{ width: '48%' }}>
                        <NoteCard
                            note={item}
                            onPress={() =>
                                navigation.navigate(
                                    'NoteDetail',
                                    {
                                        noteId: item.id,
                                    },
                                )
                            }
                        />
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            No matching notes found
                        </Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={createNote}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

export default NotesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 10,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },

    menu: {
        fontSize: 28,
    },

    search: {
        fontSize: 28,
    },

    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
    },

    searchInput: {
        backgroundColor: '#F3F3F3',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 20,
    },

    emptyContainer: {
        marginTop: 60,
        alignItems: 'center',
    },

    emptyText: {
        fontSize: 16,
        color: '#999',
    },

    fab: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#FF5A7A',
        justifyContent: 'center',
        alignItems: 'center',
    },

    fabText: {
        color: '#fff',
        fontSize: 38,
        fontWeight: '300',
    },
});