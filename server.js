const express = require("express");
const path = require("path");
const app = express();

const PORT = 3000;

app.use(express.json());


app.use(express.static(path.join(__dirname, "Anim+ 2.0")));


app.use('/videos', express.static(path.join(__dirname, 'videos')));



const users = {};

app.post("/api/register", (req, res) => {
  const { pseudo, anime, character } = req.body;
  if (!pseudo || !anime || !character) {
    return res.status(400).json({ success: false, message: "Champs requis manquants" });
  }

  if (users[pseudo]) {
    return res.json({ success: false, message: "Pseudo déjà utilisé" });
  }

  users[pseudo] = `${anime}:${character}`;
  return res.json({ success: true });
});

app.post("/api/login", (req, res) => {
  const { pseudo, anime, character } = req.body;
  if (!pseudo || !anime || !character) {
    return res.status(400).json({ success: false, message: "Champs requis manquants" });
  }

  const userKey = `${anime}:${character}`;
  if (!users[pseudo]) {
    return res.json({ success: false, message: "Utilisateur introuvable" });
  }

  if (users[pseudo] === userKey) {
    return res.json({ success: true });
  } else {
    return res.json({ success: false, message: "Mot de passe incorrect" });
  }
});

app.listen(PORT, () => {
    // Serveur démarré silencieusement
});
