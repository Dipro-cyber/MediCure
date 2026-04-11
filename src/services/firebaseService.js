import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore, collection, getDocs, addDoc,
  updateDoc, deleteDoc, doc, serverTimestamp, writeBatch,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.REACT_APP_FIREBASE_APP_ID,
};

const isConfigured = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined";

let db = null;
if (isConfigured) {
  try {
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (e) {
    console.warn("Firebase init failed:", e.message);
  }
}

export { db };
export const firebaseReady = !!db;

// ─── Medicines ───────────────────────────────────────────────────────────────
export async function fetchMedicines() {
  if (!db) return null; // null = use sample data
  const snap = await getDocs(collection(db, "medicines"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addMedicine(data) {
  if (!db) throw new Error("Firebase not configured");
  return addDoc(collection(db, "medicines"), { ...data, lastUpdated: new Date().toISOString().split("T")[0] });
}

export async function updateMedicine(id, data) {
  if (!db) throw new Error("Firebase not configured");
  return updateDoc(doc(db, "medicines", id), { ...data, lastUpdated: new Date().toISOString().split("T")[0] });
}

export async function deleteMedicine(id) {
  if (!db) throw new Error("Firebase not configured");
  return deleteDoc(doc(db, "medicines", id));
}

// Seed Firestore with sample data on first run
export async function seedMedicinesIfEmpty(sampleMedicines) {
  if (!db) return false;
  const snap = await getDocs(collection(db, "medicines"));
  if (!snap.empty) return false; // already seeded

  const batch = writeBatch(db);
  sampleMedicines.forEach(m => {
    const ref = doc(collection(db, "medicines"));
    batch.set(ref, m);
  });
  await batch.commit();
  return true;
}
