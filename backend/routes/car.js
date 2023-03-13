const express = require("express");
const router = express.Router();
const carController = require("../controllers/car");

router.post("/cars", carController.addCar);

router.get("/cars/stats", carController.getStats);

router.get("/cars", carController.getCars);

router.get("/cars/:carPN", carController.getCar);

router.post("/coordinates/:carPN", carController.updateCoordinates);

router.delete("/cars/:carPN", carController.deleteCar);

module.exports = router;
