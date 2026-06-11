/* eslint-env jest */

jest.mock('@react-native-firebase/auth', () => {
  const auth = () => ({
    currentUser: null,
    onAuthStateChanged: callback => {
      callback(null);
      return jest.fn();
    },
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signInWithCredential: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    signOut: jest.fn(),
  });

  auth.GoogleAuthProvider = {
    credential: jest.fn(),
  };

  return {
    __esModule: true,
    default: auth,
  };
});

jest.mock('@react-native-firebase/firestore', () => {
  const collection = jest.fn(() => ({
    doc: jest.fn(() => ({
      set: jest.fn(),
      onSnapshot: jest.fn(),
    })),
    where: jest.fn(() => ({
      limit: jest.fn(() => ({
        get: jest.fn(),
      })),
      onSnapshot: jest.fn(),
    })),
    add: jest.fn(),
  }));

  const firestore = () => ({
    collection,
    runTransaction: jest.fn(),
  });

  firestore.FieldValue = {
    serverTimestamp: jest.fn(),
  };

  return {
    __esModule: true,
    default: firestore,
  };
});

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    hasPlayServices: jest.fn(),
    signIn: jest.fn(),
  },
}));
