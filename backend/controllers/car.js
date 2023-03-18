const Car = require("../models/car");
const Readings = require("../models/readings");
const sequelize = require("../utils/db");

exports.getCar = async (req, res) => {
  const car = await Car.findOne({
    where: { plateNumber: req.params.carPN },
    include: {
      model: Readings,
      as: "readings",
      attributes: ["lat", "lng", "speed", "createdAt"],
      order: [["createdAt", "DESC"]],
      limit: 1,
    },
  });

  if (!car) {
    return res.status(404).json({
      message: "Car not found. Check if the plate number is correct",
    });
  }
  const { plateNumber, readings } = car;

  res.status(200).json({
    sucess: true,
    car: {
      plateNumber,
      lastLat: readings.length === 0 ? null : readings[0].lat,
      lastLng: readings.length === 0 ? null : readings[0].lng,
      lastSpeed: readings.length === 0 ? null : readings[0].speed,
      lastUpdated: readings.length === 0 ? null : readings[0].createdAt,
    },
  });
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

  const reading = await car.createReading({ lat, lng, speed });
  req.io.emit("car-updated", carPN);
  await res.status(200).json({
    success: true,
    car: {
      plateNumber: carPN,
      lastLat: reading.lat,
      lastLng: reading.lng,
      lastSpeed: reading.speed,
      lastUpdated: reading.createdAt,
    },
  });
};

exports.getCars = async (req, res) => {
  const cars = await Car.findAll({
    include: {
      model: Readings,
      as: "readings",
      limit: 1,
      order: [["createdAt", "DESC"]],
    },
  });

  const carsWithInfo = cars.map((car) => {
    return {
      plateNumber: car.plateNumber,
      lastLat: car.readings.length === 0 ? null : car.readings[0].lat,
      lastLng: car.readings.length === 0 ? null : car.readings[0].lng,
      lastSpeed: car.readings.length === 0 ? null : car.readings[0].speed,
      lastUpdated: car.readings.length === 0 ? null : car.readings[0].createdAt,
    };
  });

  res.status(200).json({
    success: true,
    cars: carsWithInfo,
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
        sequelize.fn("round", sequelize.fn("avg", sequelize.col("speed"))),
        "avgSpeed",
      ],
    ],
    group: ["plateNumber"],
  });

  res.status(200).json({ success: true, data: carsWithAvg });
};
