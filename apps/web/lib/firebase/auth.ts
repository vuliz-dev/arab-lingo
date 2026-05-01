import { getAuth, getRedirectResult, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { firebaseApp } from './app';

export const auth = getAuth(firebaseApp);

// Absorb any stale redirect state left in sessionStorage (e.g. from a
// previous signInWithRedirect attempt or storage-partitioned browsers).
getRedirectResult(auth).catch(() => {});

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function signOutUser() {
  return signOut(auth);
}
