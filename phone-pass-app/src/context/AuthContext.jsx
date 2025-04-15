import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { 
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  signOut as firebaseSignOut
} from "firebase/auth";
import { auth as firebaseAuth } from "../api/firebase"; // Ensure this is your initialized auth instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true); // Prevent memory leaks

  useEffect(() => {
    isMountedRef.current = true;

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      try {
        if (!isMountedRef.current) return;

        console.log("Auth state changed:", user);

        if (user) {
          await user.getIdToken(true); // Refresh token if needed
        }

        setCurrentUser(user);
        setError(null);
      } catch (err) {
        if (isMountedRef.current) {
          console.error("Auth state error:", err);
          setError(err);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    });

    return () => {
      console.log("Cleaning up auth listener");
      isMountedRef.current = false;
      unsubscribe();
    };
  }, []);

  const signIn = async () => {
    try {
      setLoading(true);
      setError(null);

      const provider = new GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");

      const result = await signInWithPopup(firebaseAuth, provider);
      console.log("Sign-in successful:", result.user.uid);

      return result.user;
    } catch (err) {
      console.error("Sign-in failed:", err);

      // Fallback to redirect if pop-up blocked
      if (err.code === "auth/popup-blocked") {
        console.warn("Popup blocked. Using redirect...");
        await signInWithRedirect(firebaseAuth, provider);
      } else {
        setError(new Error("Failed to sign in. Please try again."));
        throw new Error("Sign-in failed. Check your network or credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(firebaseAuth);
      console.log("Sign-out successful");
    } catch (err) {
      console.error("Sign-out failed:", err);
      setError(new Error("Failed to sign out. Please try again."));
      throw new Error("Sign-out failed. Check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const refreshToken = async (force = false) => {
    if (!currentUser) {
      console.warn("No current user. Cannot refresh token.");
      return null;
    }
    try {
      return await currentUser.getIdToken(force);
    } catch (err) {
      console.error("Token refresh failed:", err);
      throw new Error("Failed to refresh token. Please sign in again.");
    }
  };

  const value = {
    currentUser,
    user: currentUser, // Alias for backward compatibility
    loading,
    error,
    signIn,
    signOut,
    clearError,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div className="auth-loading" style={{ textAlign: 'center'}}>Loading Authentication...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context.currentUser && context.loading === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
