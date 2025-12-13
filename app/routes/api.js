const express = require('express');
const router = express.Router();
const User = require('../models/Team');
const TeamController = require('../controllers/TeamController');
const CarController = require('../controllers/CarController');

router.post("/team", TeamController.createPost)

router.delete("/team/delete/:id", TeamController.delete)
// router.put("/team/edit", TeamController.editPut);

router.post("/car", CarController.createPost)
router.delete("/car/delete/:id", CarController.delete)

module.exports = router;
