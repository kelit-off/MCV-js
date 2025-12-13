const express = require('express');
const router = express.Router();
const User = require('../models/Team');
const TeamController = require('../controllers/TeamController');

router.post("/team", TeamController.createPost)

router.delete("/team/delete/:id", TeamController.delete)

// router.put("/team/edit", TeamController.editPut);

module.exports = router;
