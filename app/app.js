const express = require('express');
const app = express();
const webRoutes = require('./routes/web');
const { default: mongoose } = require('mongoose');
require("dotenv").config();

// Pour parser le body des formulaires
app.use(express.urlencoded({ extended: true }));

// Pour parser le JSON si nécessaire
app.use(express.json());

// **Enregistrer les routes**
app.use('/', webRoutes);

// Dossier public pour CSS / JS
app.use(express.static('public'));

// Connexion a la BDD
if (!process.env.DB_URL) {
    console.error("Erreur : DB_URL est undefined !");
    process.exit(1);
}

mongoose.connect(process.env.DB_URL)
.then(() => console.log("MongoDB connecté"))
.catch(err => console.log(err))

// Démarrer le serveur
const PORT = 3000;
const HOST = 'localhost';

app.listen(PORT, HOST, () => {
    console.log(`Serveur démarré sur http://${HOST}:${PORT}`);
});