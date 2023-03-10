const Car = require("../models/car");
const Readings = require("../models/readings");
const sequelize = require("../utils/db");

exports.getCar = async (req, res) => {
    const car = await Car.findOne({
        where: { plateNumber: req.params.carPN },
    });
    if (!car) {
        return res.status(404).json({
            message: "Car not found. Check if the plate number is correct",
        });
    }

    res.status(200).json({ sucess: true, car });
};

exports.addCar = async (req, res) => {
    const isFound = await Car.findOne({
        where: { plateNumber: req.body.plateNumber },
    });
    if (isFound) {
        return res
            .status(400)
            .json({ message: "Car is already registered on the system" });
    }
    const newCar = await Car.create({ plateNumber: req.body.plateNumber });

    res.status(201).json({ success: true, car: newCar });
};

exports.updateCoordinates = async (req, res) => {
    const carPN = req.params.carPN.toLowerCase();
    const { lat, lng, speed } = req.body;
    const car = await Car.findOne({
        where: { plateNumber: carPN },
    });

    if (!car)
        return res.status(404).json({
            message: "Car not found. Check if the plate number is correct",
        });

    // we can use validators but this is for simplicity
    // update car current stats
    car.set({
        lastLat: lat,
        lastLng: lng,
        lastSpeed: Math.round(speed),
    });
    await car.save();

    // insert new reading to readings table
    const newReading = await Readings.create({
        plateNumber: carPN,
        lat,
        lng,
        speed: Math.round(speed),
    });

    await res.status(200).json({ success: true, car });
};

exports.getCars = async (req, res) => {
    const cars = await Car.findAll();
    res.status(200).json({
        success: true,
        cars,
    });
};

exports.deleteCar = async (req, res) => {
    const car = await Car.findOne({
        where: { plateNumber: req.params.carPN },
    });

    if (!car) {
        return res.status(404).json({
            message: "Car not found. Check if the plate number is correct",
        });
    }

    await car.destroy();
    res.status(200).json({
        success: true,
        message: `Car with plate number ${car.plateNumber} is deleted from the system.`,
    });
};

exports.getStats = async (req, res) => {
    const carsWithAvg = await Readings.findAll({
        attributes: [
            "plateNumber",
            [
                sequelize.fn(
                    "round",
                    sequelize.fn("avg", sequelize.col("speed"))
                ),
                "avgSpeed",
            ],
        ],
        group: ["plateNumber"],
    });

    res.status(200).json({ success: true, data: carsWithAvg });
};
