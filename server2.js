require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");

const privatesInformations = [
  {
    userName: "Gab",
    private: "J'aime le chocolat",
  },
  {
    userName: "Marie",
    private: "J'ai une lambo dans mon garage",
  },
];

// Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  let token;
  if (authHeader) {
    token = authHeader.split(" ")[1];
  }

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET, (err, payload) => {
    if (err) return res.sendStatus("403");

    req.userName = payload.userName;

    next();
  });
}

const app = express();

app.use(express.json());

app.get("/privates", authenticateToken, (req, res) => {
  //req.userName

  res.json(privatesInformations.filter((p) => p.userName === req.userName));
});

app.post("/login", (req, res) => {
  // Authenticate user here

  const userName = req.body.userName;

  const payload = { userName };

  const token = jwt.sign(payload, process.env.SECRET);

  res.json({ token });
});

app.listen(4000);
