const Car = require("../models/car");

const getCarInfo = async (carPN) => {
    return await Car.findOne({ where: { plateNumber: carPN } });
};

module.exports = getCarInfo;
