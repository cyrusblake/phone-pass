import { auth, googleProvider, signInWithPopup } from "./firebase";
import { getUserProfile, createUserProfile } from "./firestore";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify"; // Use for better notifications

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const provider = googleProvider;
    provider.setCustomParameters({
      prompt: "select_account",
    });

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const profile = await getUserProfile(user.uid);
    if (!profile) {
      await createUserProfile(user.uid, {
        email: user.email,
        name: user.displayName,
        uid: user.uid,
      });
    }

    toast.success(`Signed in as ${user.email}`);
  } catch (e) {
    if (e.code === "auth/popup-closed-by-user") {
      toast.warning("Sign-in popup closed. Try again.");
    } else if (e.code === "auth/cancelled-popup-request") {
      toast.warning("Sign-in request was canceled. Try again.");
    } else if (e.code === "auth/popup-blocked") {
      toast.warning("Popup was blocked. Allow popups for this site.");
    } else {
      toast.error(`Sign-in error: ${e.message}`);
    }
  }
};

// Sign out
export const signOutFromGoogle = async () => {
  try {
    await signOut(auth);
    toast.info("Signed out!");
  } catch (e) {
    toast.error(`Sign-out error: ${e.message}`);
  }
};

