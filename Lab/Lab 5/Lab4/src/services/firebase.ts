import firestore from '@react-native-firebase/firestore';

import { Note } from '../types/Note';

const NOTES_COLLECTION = 'notes';

class FirebaseService {
    getAllNotes(
        callback: (notes: Note[]) => void,
    ) {
        return firestore()
            .collection(NOTES_COLLECTION)
            .onSnapshot(snapshot => {
                const notes: Note[] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...(doc.data() as Omit<Note, 'id'>),
                }));

                callback(notes);
            });
    }

    getNoteById(
        noteId: string,
        callback: (note: Note | null) => void,
    ) {
        return firestore()
            .collection(NOTES_COLLECTION)
            .doc(noteId)
            .onSnapshot(documentSnapshot => {
                const data = documentSnapshot.data();

                if (!data) {
                    callback(null);
                    return;
                }

                callback({
                    id: documentSnapshot.id,
                    ...(data as Omit<Note, 'id'>),
                });
            });
    }

    async createNote(color: string) {
        const document = await firestore()
            .collection(NOTES_COLLECTION)
            .add({
                title: '',
                content: '',
                color,
                createdAt:
                    firestore.FieldValue.serverTimestamp(),
                updatedAt:
                    firestore.FieldValue.serverTimestamp(),
            });

        return document.id;
    }

    async updateNote(
        noteId: string,
        title: string,
        content: string,
    ) {
        await firestore()
            .collection(NOTES_COLLECTION)
            .doc(noteId)
            .update({
                title,
                content,
                updatedAt:
                    firestore.FieldValue.serverTimestamp(),
            });
    }

    async deleteNote(noteId: string) {
        await firestore()
            .collection(NOTES_COLLECTION)
            .doc(noteId)
            .delete();
    }
}

export default new FirebaseService();