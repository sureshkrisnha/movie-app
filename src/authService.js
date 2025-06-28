// src/authService.js
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
  } from "firebase/auth";
  import { auth } from "./firebase"; // Import the initialized auth instance
  
  class AuthService {
    async signup(email, password, displayName) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        // Optional: Update user profile with display name
        if (userCredential.user && displayName) {
          // Firebase doesn't directly support displayName in createUserWithEmailAndPassword
          // You'd typically update the profile *after* creation if needed, e.g.,
          // await updateProfile(userCredential.user, { displayName });
          // For simplicity, we'll just return the userCredential for now.
        }
        return userCredential.user;
      } catch (error) {
        console.error("Firebase signup error:", error.message);
        throw error;
      }
    }
  
    async login(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        return userCredential.user;
      } catch (error) {
        console.error("Firebase login error:", error.message);
        throw error;
      }
    }
  
    async logout() {
      try {
        await signOut(auth);
        return true;
      } catch (error) {
        console.error("Firebase logout error:", error.message);
        throw error;
      }
    }
  
    // This is used by AuthContext to listen for auth state changes
    onAuthChange(callback) {
      return onAuthStateChanged(auth, callback);
    }
  
    getCurrentUser() {
      // Returns the current user if logged in, otherwise null
      return auth.currentUser;
    }
  }
  
  const authService = new AuthService();
  export default authService;