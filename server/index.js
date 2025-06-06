const express = require("express");
const myUtils = require("./myUtils.js");

const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0xd987a27f4513980d64b5": 95,
  "0x514b32b0918e1db65542": 100,
  "0xef7c3345979803d153fb": 50,
};

app.get("/balance", (req, res) => {
  const { secretMsg, signature } = req.query;

  if (!secretMsg || !signature) {
    return res
      .status(400)
      .send({ error: "secretMsg and signature are required" });
  }

  const address = myUtils.getAddressFromSecretMsg(secretMsg, signature);
  const balance = balances[address] || 0;
  res.send({ address, balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
