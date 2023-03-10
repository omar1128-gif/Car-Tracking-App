const Sequelize = require("sequelize");

const sequelize = require("../utils/db");

const Car = sequelize.define("Car", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    plateNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    lastLat: {
        type: Sequelize.DOUBLE,
        defaultValue: null,
    },
    lastLng: {
        type: Sequelize.DOUBLE,
        defaultValue: null,
    },
    lastSpeed: {
        type: Sequelize.INTEGER,
        defaultValue: null,
    },
});

module.exports = Car;
