
import { auth, googleProvider, signInWithPopup } from "./firebase";
import { getUserProfile, createUserProfile } from "./firestore";

// Sign up with google
export const signInWithGoogle = async () => {
  try {
    const provider = googleProvider;
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const profile = await getUserProfile(user.uid);
    if (!profile) {
      await createUserProfile(user.uid, {
        email: user.email,
        name: user.displayName, // Updated from user.name to user.displayName
        uid: user.uid
      });
    }

    window.alert(`Signed in with ${user.email}`);
    window.location.reload();
  } catch (e) {
    window.alert(e.message);
  }
};

// Sign out from google
export const signOutFromGoogle = async () => {
  try {
    await auth.signOut();
    window.alert("Signed out!");
    window.location.reload();
  } catch (e) {
    window.alert(e.message);
  }
};


// // Sign up
// export const signUp = async (email, password) => {
//   try {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     return userCredential.user;
//   } catch (error) {
//     console.error("Error signing up:", error);
//     throw error;
//   }
// };

// // Log in
// export const logIn = async (email, password) => {
//   try {
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     return userCredential.user;
//   } catch (error) {
//     console.error("Error logging in:", error);
//     throw error;
//   }
// };

// // Log out
// export const logOut = async () => {
//   try {
//     await signOut(auth);
//   } catch (error) {
//     console.error("Error logging out:", error);
//     throw error;
//   }
// };