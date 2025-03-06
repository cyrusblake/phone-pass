import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();

// Sign up
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    console.log("User signed up:", userCredential.user);
  })
  .catch((error) => {
    console.error("Error signing up:", error);
  });

// Log in
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    console.log("User logged in:", userCredential.user);
  })
  .catch((error) => {
    console.error("Error logging in:", error);
  });