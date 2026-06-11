import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { Note } from '../types/Note';

const NOTES_COLLECTION = 'notes';
const USERS_COLLECTION = 'users';

GoogleSignin.configure({
    webClientId: '558111392940-qgq65a3h6fm9m8f0krutj53u79i2542g.apps.googleusercontent.com',
});

export interface AuthProfile {
    uid: string;
    email: string;
    username?: string;
    phoneNumber?: string;
    displayName?: string;
    photoURL?: string;
}

interface SignUpPayload {
    email: string;
    password: string;
    username?: string;
    phoneNumber?: string;
}

class FirebaseService {
    onAuthStateChanged(
        callback: (
            user: FirebaseAuthTypes.User | null,
        ) => void,
    ) {
        return auth().onAuthStateChanged(callback);
    }

    getCurrentUser() {
        return auth().currentUser;
    }

    async signInWithPassword(
        identifier: string,
        password: string,
    ) {
        const email =
            await this.resolveEmailFromIdentifier(
                identifier,
            );

        return auth().signInWithEmailAndPassword(
            email,
            password,
        );
    }

    async signUpWithPassword({
        email,
        password,
        username,
        phoneNumber,
    }: SignUpPayload) {
        const credential =
            await auth().createUserWithEmailAndPassword(
                email.trim(),
                password,
            );

        const displayName = username?.trim();

        if (displayName) {
            await credential.user.updateProfile({
                displayName,
            });
        }

        await this.upsertUserProfile(
            credential.user,
            {
                username,
                phoneNumber,
            },
        );

        return credential;
    }

    async signInWithGoogle() {
        await GoogleSignin.hasPlayServices({
            showPlayServicesUpdateDialog: true,
        });

        const signInResult = await GoogleSignin.signIn();
        const idToken = signInResult.data?.idToken;

        if (!idToken) {
            throw new Error(
                'Google sign-in did not return an ID token.',
            );
        }

        const credential =
            auth.GoogleAuthProvider.credential(idToken);

        const userCredential =
            await auth().signInWithCredential(credential);

        await this.upsertUserProfile(
            userCredential.user,
        );

        return userCredential;
    }

    async sendPasswordReset(identifier: string) {
        const email =
            await this.resolveEmailFromIdentifier(
                identifier,
            );

        return auth().sendPasswordResetEmail(email);
    }

    async signOut() {
        await auth().signOut();
    }

    getAllNotes(
        callback: (notes: Note[]) => void,
    ) {
        const user = this.requireUser();

        return firestore()
            .collection(NOTES_COLLECTION)
            .where('ownerId', '==', user.uid)
            .onSnapshot(snapshot => {
                const notes: Note[] = snapshot.docs
                    .map(doc => ({
                        id: doc.id,
                        ...(doc.data() as Omit<Note, 'id'>),
                    }))
                    .sort(
                        (first, second) =>
                            this.toMillis(
                                second.updatedAt,
                            ) -
                            this.toMillis(
                                first.updatedAt,
                            ),
                    );

                callback(notes);
            });
    }

    getNoteById(
        noteId: string,
        callback: (note: Note | null) => void,
    ) {
        const user = this.requireUser();

        return firestore()
            .collection(NOTES_COLLECTION)
            .doc(noteId)
            .onSnapshot(documentSnapshot => {
                const data = documentSnapshot.data();

                if (!data) {
                    callback(null);
                    return;
                }

                if (data.ownerId !== user.uid) {
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
        const user = this.requireUser();

        const document = await firestore()
            .collection(NOTES_COLLECTION)
            .add({
                ownerId: user.uid,
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
        const user = this.requireUser();

        const noteRef = firestore()
            .collection(NOTES_COLLECTION)
            .doc(noteId);

        await firestore().runTransaction(
            async transaction => {
                const snapshot =
                    await transaction.get(noteRef);
                const data = snapshot.data();

                if (!data || data.ownerId !== user.uid) {
                    throw new Error(
                        'You do not have permission to update this note.',
                    );
                }

                transaction.update(noteRef, {
                    title,
                    content,
                    updatedAt:
                        firestore.FieldValue.serverTimestamp(),
                });
            },
        );
    }

    async deleteNote(noteId: string) {
        const user = this.requireUser();

        const noteRef = firestore()
            .collection(NOTES_COLLECTION)
            .doc(noteId);

        await firestore().runTransaction(
            async transaction => {
                const snapshot =
                    await transaction.get(noteRef);
                const data = snapshot.data();

                if (!data || data.ownerId !== user.uid) {
                    throw new Error(
                        'You do not have permission to delete this note.',
                    );
                }

                transaction.delete(noteRef);
            },
        );
    }

    private async resolveEmailFromIdentifier(
        identifier: string,
    ) {
        const value = identifier.trim();

        if (!value) {
            throw new Error(
                'Enter your username, email, or phone number.',
            );
        }

        if (value.includes('@')) {
            return value;
        }

        const normalized = value.toLowerCase();
        const users = firestore().collection(
            USERS_COLLECTION,
        );

        const usernameSnapshot = await users
            .where('usernameLower', '==', normalized)
            .limit(1)
            .get();

        const phoneSnapshot = usernameSnapshot.empty
            ? await users
                  .where('phoneNumber', '==', value)
                  .limit(1)
                  .get()
            : null;

        const profile =
            usernameSnapshot.docs[0]?.data() ??
            phoneSnapshot?.docs[0]?.data();

        if (!profile?.email) {
            throw new Error(
                'No account found for that username, email, or phone number.',
            );
        }

        return profile.email as string;
    }

    private async upsertUserProfile(
        user: FirebaseAuthTypes.User,
        profile?: Partial<AuthProfile>,
    ) {
        const username =
            profile?.username?.trim() ||
            user.displayName ||
            user.email?.split('@')[0] ||
            '';

        await firestore()
            .collection(USERS_COLLECTION)
            .doc(user.uid)
            .set(
                {
                    uid: user.uid,
                    email: user.email ?? profile?.email ?? '',
                    username,
                    usernameLower:
                        username.toLowerCase(),
                    phoneNumber:
                        profile?.phoneNumber?.trim() ||
                        user.phoneNumber ||
                        '',
                    displayName:
                        user.displayName || username,
                    photoURL: user.photoURL || '',
                    updatedAt:
                        firestore.FieldValue.serverTimestamp(),
                },
                { merge: true },
            );
    }

    private requireUser() {
        const user = auth().currentUser;

        if (!user) {
            throw new Error(
                'You must be signed in to use notes.',
            );
        }

        return user;
    }

    private toMillis(value: unknown) {
        if (
            value &&
            typeof value === 'object' &&
            'toMillis' in value &&
            typeof value.toMillis === 'function'
        ) {
            return value.toMillis();
        }

        if (value instanceof Date) {
            return value.getTime();
        }

        return 0;
    }
}

export default new FirebaseService();
