const express = require('express');
const path = require('path');
const app = express();

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use(express.static(__dirname));

// Routes principales
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Index.html'));
});

app.get('/accueil', (req, res) => {
  res.sendFile(path.join(__dirname, 'Accueil.html'));
});

app.get('/catalogue', (req, res) => {
  res.sendFile(path.join(__dirname, 'Catalogue.html'));
});

app.get('/planning', (req, res) => {
  res.sendFile(path.join(__dirname, 'Planning.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'profile.html'));
});

app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'search.html'));
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'Index.html'));
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Une erreur est survenue!');
});

// Configuration du port
const PORT = process.env.PORT || 3000;

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`Pour accéder à l'application, ouvrez votre navigateur et allez à:`);
  console.log(`http://localhost:${PORT}`);
}); 