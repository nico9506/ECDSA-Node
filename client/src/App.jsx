import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [secretMsg, setSecretMsg] = useState("");
  const [signature, setSignature] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        secretMsg={secretMsg}
        setSecretMsg={setSecretMsg}
        signature={signature}
        setSignature={setSignature}
      />
      <Transfer setBalance={setBalance} address={address} />
    </div>
  );
}

export default App;
