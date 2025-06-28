// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../authService'; // Import your Firebase authService

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = authService.onAuthChange((currentUser) => {
      if (currentUser) {
        setIsAuthenticated(true);
        setUser(currentUser);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const currentUser = await authService.login(email, password);
      if (currentUser) {
        setIsAuthenticated(true);
        setUser(currentUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      return false;
    }
  };

  const signup = async (email, password, name) => { // 'name' parameter is for display, Firebase email/password signup doesn't directly use it here
    try {
      const newUser = await authService.signup(email, password, name);
      if (newUser) {
        setIsAuthenticated(true);
        setUser(newUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Signup failed:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);