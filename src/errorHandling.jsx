import { generateLogURL } from "./config/APIs";
import { AES_Encryption, AES_Decryption } from "./auth/encryption/Encryption";

export const generateLog = async (msg, err) => {
  // const encData = AES_Encryption(
  //   JSON.stringify({
  //     level: 'error',
  //     message: msg,
  //     stacktrace: err.stack,
  //   })
  // );
  // const response = await fetch(generateLogURL, {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     khasgafsgauysuaysyuasyahghagsggadkdcnviw: encData,
  //   }),
  //   headers: new Headers({
  //     'Content-Type': 'application/json',
  //     Authorization: `Basic ${window.btoa('mbm:mbm123')}`,
  //   }),
  // })
  //   .then((res) => res.json())
  //   .then((res) => {
  //     // console.log(res);
  //   })
  //   .catch((err) => {
  //     return err;
  //   });

  // return response;
};

// generateLog("Error during onload alert Message API call", err);
