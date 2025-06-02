import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import * as keccak from "ethereum-cryptography/keccak";
import * as utils from "ethereum-cryptography/utils";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  //
  //   async function onChange(evt) {
  //   const address = evt.target.value;
  //   setAddress(address);
  //   if (address) {
  //     const {
  //       data: { balance },
  //     } = await server.get(`balance/${address}`);
  //     setBalance(balance);
  //   } else {
  //     setBalance(0);
  //   }
  // }

  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    const publicKey = secp.getPublicKey(privateKey, false);

    // Drop the first byte (0x04), use only the 64-byte X+Y part
    const pubKeyWithoutPrefix = publicKey.slice(1); // 64 bytes

    // Hash the public key with keccak256
    const hashed = keccak.keccak256(pubKeyWithoutPrefix);

    // Take the last 20 bytes
    // Convert to hex address
    setAddress("0x" + utils.toHex(hashed).slice(-20));

    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      {/* <label> */}
      {/*   Wallet Address */}
      {/*   <input */}
      {/*     placeholder="Type an address, for example: 0x1" */}
      {/*     value={address} */}
      {/*     onChange={onChange} */}
      {/*   ></input> */}
      {/* </label> */}
      {/**/}
      <label>
        Private Key
        <input
          placeholder="Type your private key (hex)"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>

      <div className="balance">
        Address: {address.slice(0, 4) + "..." + address.slice(-4)}
      </div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
