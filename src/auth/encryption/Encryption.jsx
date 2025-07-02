
import CryptoJS from "crypto-js"

export const AES_Encryption = (data) => {
  const key = import.meta.env.VITE_ENCRYPTION_API_KEY;
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(data, key, { iv:iv});
  return iv.toString(CryptoJS.enc.Base64) + encrypted;
}

export const AES_Decryption = (encryptedData) => {

  const ivHex = encryptedData.substring(0, 24); // IV is the first 16 bytes (32 characters in hexadecimal)
  const iv = CryptoJS.enc.Base64.parse(ivHex);
  const key = "wertyuioplkjhgfdsazxcvbnmkiujnhy"; 

  const encryptedDataHex = encryptedData.substring(24); // Encrypted data is the rest of the string
  const decrypted = CryptoJS.AES.decrypt(encryptedDataHex,key,{iv:iv});//,key,{iv:iv}

  const retVal =  JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  return retVal;
}
