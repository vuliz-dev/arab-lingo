import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export function getFirebaseApp(config: FirebaseConfig): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(config);
}
