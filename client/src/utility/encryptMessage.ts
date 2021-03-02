import CryptoJS from "crypto-js";

export function encryptMessage(message: any) {
  const messageString = JSON.stringify(message);
  return CryptoJS.AES.encrypt(messageString, "secret key 123");
}
