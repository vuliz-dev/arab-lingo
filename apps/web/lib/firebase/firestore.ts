import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { firebaseApp } from './app';

export const db = getFirestore(firebaseApp);

export type SavedWord = {
  id: string;
  slug: string;
  arabic: string;
  english: string;
  vietnamese: string;
  ipa: string;
  savedAt: number;
};

export async function saveWord(uid: string, word: SavedWord): Promise<void> {
  await setDoc(doc(db, 'users', uid, 'savedWords', word.slug), word);
}

export async function unsaveWord(uid: string, slug: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid, 'savedWords', slug));
}

export async function isWordSaved(uid: string, slug: string): Promise<boolean> {
  return (await getDoc(doc(db, 'users', uid, 'savedWords', slug))).exists();
}

export async function fetchSavedWords(uid: string): Promise<SavedWord[]> {
  const snap = await getDocs(
    query(collection(db, 'users', uid, 'savedWords'), orderBy('savedAt', 'desc'))
  );
  return snap.docs.map((d) => d.data() as SavedWord);
}
