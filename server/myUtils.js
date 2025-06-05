import { keccak256 } from "ethereum-cryptography/keccak.js";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils.js";
import {
  utils,
  getPublicKey,
  sign,
  recoverPublicKey,
} from "ethereum-cryptography/secp256k1.js";
import { sha256 } from "ethereum-cryptography/sha256.js";

const messages = ["msg 1", "msg 2", "msg 3"];

const generateSecureRandomKey = async (message) => {
  const newRandomPrivateKey = utils.randomPrivateKey();
  const privateKeyHex = toHex(newRandomPrivateKey);
  const publicKey = getPublicKey(newRandomPrivateKey, false);
  const publicKeyHex = toHex(publicKey);

  const messageBytes = utf8ToBytes(message);
  const sha256Message = sha256(messageBytes);
  const hexMessage = toHex(sha256Message);

  // signing
  const [signature, recovery] = await sign(sha256Message, newRandomPrivateKey, {
    recovered: true,
  });

  const recoveredPubKey = recoverPublicKey(hexMessage, signature, recovery);
  const recoveredPubKeyHex = toHex(recoveredPubKey);
  const address = "0x" + toHex(keccak256(publicKey.slice(1))).slice(-20); // Remove 0x04 prefix
  const addressRecovered =
    "0x" + toHex(keccak256(recoveredPubKey.slice(1))).slice(-20); // Remove 0x04 prefix

  return {
    newRandomPrivateKey,
    privateKeyHex,
    publicKey,
    publicKeyHex,
    message,
    messageBytes,
    sha256Message,
    hexMessage,
    signature,
    recovery,
    recoveredPubKey,
    recoveredPubKeyHex,
    address,
    addressRecovered,
  };
};

// for (let msg of messages) {
//   const keyInfo = await generateSecureRandomKey(msg);
//   console.log(keyInfo);
// }

const getAddressFromSecretMsg = (secretMsg, signature) => {
  const messageBytes = utf8ToBytes(secretMsg);
  const sha256Message = sha256(messageBytes);
  const hexMessage = toHex(sha256Message);

  const signatureBytes = hexToBytes(signature);

  const recoveredPubKey = recoverPublicKey(hexMessage, signatureBytes, 1);
  const addressRecovered =
    "0x" + toHex(keccak256(recoveredPubKey.slice(1))).slice(-20); // Remove 0x04 prefix

  return addressRecovered;
};

const hexToBytes = (hex) => {
  if (hex.startsWith("0x")) hex = hex.slice(2); // remove 0x prefix if present
  if (hex.length % 2 !== 0)
    throw new Error("Hex string must have an even length");

  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
};

export { getAddressFromSecretMsg };
