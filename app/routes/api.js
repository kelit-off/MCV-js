const express = require('express');
const router = express.Router();
const User = require('../models/Team');

// --- Liste des utilisateurs ---
router.get('/users', (req, res) => {
    res.json(User.all());
});

// --- Créer un utilisateur ---
router.post('/users', express.json(), (req, res) => {
    const { name, email } = req.body;
    const user = new User({ name, email });
    user.save();
    res.status(201).json(user);
});

// --- Récupérer un utilisateur ---
router.get('/users/:id', (req, res) => {
    const user = User.find(req.params.id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json(user);
});

// --- Modifier un utilisateur ---
router.put('/users/:id', express.json(), (req, res) => {
    const user = User.find(req.params.id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    user.name = req.body.name;
    user.email = req.body.email;
    user.save();
    res.json(user);
});

// --- Supprimer un utilisateur ---
router.delete('/users/:id', (req, res) => {
    const user = User.find(req.params.id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    User.delete(req.params.id);
    res.json({ message: "Utilisateur supprimé" });
});

module.exports = router;
