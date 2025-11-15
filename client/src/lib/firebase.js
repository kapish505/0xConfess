import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbvgq32HloZA2JEJ0KntlGehAJN79uR58",
  authDomain: "socialwall12.firebaseapp.com",
  projectId: "socialwall12",
  storageBucket: "socialwall12.firebasestorage.app",
  messagingSenderId: "172675351232",
  appId: "1:172675351232:web:155a4178ead31028832325",
  measurementId: "G-7QWJCGE2TN"
};

// Check if Firebase is configured (has real API key, not placeholder)
export const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY_HERE" && 
                            firebaseConfig.apiKey.length > 0;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Initialize Analytics (only in browser environment)
export let analytics = null;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn("Firebase Analytics initialization failed:", error);
  }
}

// Log configuration status
if (isConfigured) {
  console.log("✅ Firebase configured and connected");
} else {
  console.warn(
    "⚠️ Firebase is not configured!\n\n" +
    "To enable full functionality:\n" +
    "1. Create a Firebase project at https://console.firebase.google.com/\n" +
    "2. Set up Firestore Database\n" +
    "3. Replace the config in client/src/lib/firebase.js\n" +
    "4. See FIREBASE_SETUP.md for detailed instructions\n\n" +
    "The app will work in demo mode with local state only."
  );
}
