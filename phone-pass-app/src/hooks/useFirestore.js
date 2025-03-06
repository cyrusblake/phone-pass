// import { useState, useEffect } from "react";
// import { getUserProfile, findNearbyUsers } from "../api/firestore";

// const useFirestore = (userId) => {
//   const [profile, setProfile] = useState(null);
//   const [nearbyUsers, setNearbyUsers] = useState([]);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const profileData = await getUserProfile(userId);
//       setProfile(profileData);
//     };
//     fetchProfile();
//   }, [userId]);

//   const fetchNearbyUsers = async (latitude, longitude, radius) => {
//     const users = await findNearbyUsers(latitude, longitude, radius);
//     setNearbyUsers(users);
//   };

//   return { profile, nearbyUsers, fetchNearbyUsers };
// };

// export default useFirestore;