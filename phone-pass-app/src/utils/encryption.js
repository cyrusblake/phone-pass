// // Generate a key for encryption
// const generateKey = async () => {
//     const key = await crypto.subtle.generateKey(
//       { name: "AES-GCM", length: 256 },
//       true, // Whether the key is extractable
//       ["encrypt", "decrypt"] // Key usages
//     );
//     return key;
//   };
  
//   // Encrypt data
//   const encryptData = async (data, key) => {
//     const encodedData = new TextEncoder().encode(data);
//     const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
//     const encryptedData = await crypto.subtle.encrypt(
//       { name: "AES-GCM", iv },
//       key,
//       encodedData
//     );
//     return { encryptedData, iv };
//   };
  
//   // Decrypt data
//   const decryptData = async (encryptedData, key, iv) => {
//     const decryptedData = await crypto.subtle.decrypt(
//       { name: "AES-GCM", iv },
//       key,
//       encryptedData
//     );
//     return new TextDecoder().decode(decryptedData);
//   };
  
//   export { generateKey, encryptData, decryptData };