import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { firebaseApp } from './app';

export const auth = getAuth(firebaseApp);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function signOutUser() {
  return signOut(auth);
}
