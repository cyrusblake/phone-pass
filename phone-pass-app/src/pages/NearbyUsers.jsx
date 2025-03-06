import { collection, query, where, getDocs } from "firebase/firestore";

const findNearbyUsers = async (latitude, longitude, radius) => {
  const usersRef = collection(db, "users");
  const q = query(
    usersRef,
    where("latitude", ">=", latitude - radius),
    where("latitude", "<=", latitude + radius),
    where("longitude", ">=", longitude - radius),
    where("longitude", "<=", longitude + radius)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log("Nearby user:", doc.data());
  });
};


