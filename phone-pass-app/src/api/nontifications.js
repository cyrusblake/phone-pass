// const sendNotification = async (userId, message) => {
//     await fetch("https://fcm.googleapis.com/fcm/send", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `key=${FCM_SERVER_KEY}`,
//       },
//       body: JSON.stringify({
//         to: `/topics/${userId}`,
//         notification: {
//           title: "New Interaction",
//           body: message,
//         },
//       }),
//     });
//   };