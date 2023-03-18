const Sequelize = require("sequelize");

const sequelize = require("../utils/db");
const Readings = require("./readings");

const Car = sequelize.define("Car", {
    plateNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
    },
});

Car.hasMany(Readings, {
    as: "readings",
    foreignKey: "plateNumber",
    onDelete: "CASCADE",
});
Readings.belongsTo(Car, { foreignKey: "plateNumber" });
module.exports = Car;
