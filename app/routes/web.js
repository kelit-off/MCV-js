const express = require('express');
const router = express.Router();
const TeamController = require('../controllers/TeamController');

// Middleware pour parser les formulaires
const parseForm = express.urlencoded({ extended: true });

// --- Accueil : liste des utilisateurs ---
router.get('/', TeamController.index);
// --- Création d'un utilisateur ---
// router.get('/team/create', TeamController.createForm);
// router.post('/users/create', parseForm, TeamController.create);

// // --- Modification d'un utilisateur ---
// router.get('/users/edit/:id', TeamController.editForm);
// router.post('/users/edit/:id', parseForm, TeamController.edit);

// // --- Suppression d'un utilisateur ---
// router.get('/users/delete/:id', TeamController.delete);

module.exports = router;
