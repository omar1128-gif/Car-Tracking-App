const Sequelize = require("sequelize");

const sequelize = require("../utils/db");

const Readings = sequelize.define("Readings", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    lat: {
        type: Sequelize.DOUBLE,
        defaultValue: null,
    },
    lng: {
        type: Sequelize.DOUBLE,
        defaultValue: null,
    },
    speed: {
        type: Sequelize.INTEGER,
        defaultValue: null,
    },
});

module.exports = Readings;
