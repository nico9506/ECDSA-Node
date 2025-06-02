const secp = require("ethereum-cryptography/secp256k1");
const keccak = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

const newRandomKeys = () => {
  const privateKey = secp.utils.randomPrivateKey();
  const privateKeyHex = toHex(privateKey);

  const publicKey = secp.getPublicKey(privateKey, false);

  // Drop the first byte (0x04), use only the 64-byte X+Y part
  const pubKeyWithoutPrefix = publicKey.slice(1); // 64 bytes

  // Hash the public key with keccak256
  const hashed = keccak.keccak256(pubKeyWithoutPrefix);

  // Take the last 20 bytes

  // Convert to hex address
  const publicKeyHex = "0x" + toHex(hashed).slice(-20);

  return {
    // privateKey: privateKey,
    privateKeyHex: privateKeyHex,
    // publicKey: publicKey,
    publicKeyHex: publicKeyHex,
  };
};

for (let i = 0; i < 3; i++) {
  console.log(newRandomKeys());
}
