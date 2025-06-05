import server from "./server";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  secretMsg,
  setSecretMsg,
  signature,
  setSignature,
}) {
  async function onChange(evt) {
    const { name, value } = evt.target;

    // Update the appropriate state
    if (name === "secretMsg") {
      setSecretMsg(value);
    } else if (name === "signature") {
      setSignature(value);
    }

    // Use local variables to get updated values before state updates fully propagate
    const updatedSecretMsg = name === "secretMsg" ? value : secretMsg;
    const updatedSignature = name === "signature" ? value : signature;

    // Only proceed if both are filled
    if (updatedSecretMsg && updatedSignature) {
      try {
        const {
          data: { address, balance },
        } = await server.get("/balance", {
          params: {
            secretMsg: updatedSecretMsg,
            signature: updatedSignature,
          },
        });

        setAddress(address);
        setBalance(balance);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setAddress("");
        setBalance(0);
      }
    } else {
      setAddress("");
      setBalance(0);
    }
  }
  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Secret message
        <input
          name="secretMsg"
          placeholder="Type your secret message"
          value={secretMsg}
          onChange={onChange}
        ></input>
      </label>

      <label>
        Signature
        <input
          name="signature"
          placeholder="Signature"
          value={signature}
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
