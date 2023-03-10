const express = require("express");
const sequelize = require("./utils/db");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

const carRoutes = require("./routes/car");
const getCarInfo = require("./utils/dbQueries");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
    },
});

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

io.on("connection", (socket) => {
    let trackIntervalId;
    console.log(`New Client connected!, ${socket.id}`);
    console.log("Number of connected clients: ", io.engine.clientsCount);

    socket.on("track-car", (carPN) => {
        console.log(`Started tracking car with PN (${carPN})`);
        trackIntervalId = setInterval(async () => {
            console.log("Sent to user with id", socket.id);
            const carUpdated = await getCarInfo(carPN);
            socket.emit("send-updated-car", carUpdated);
        }, 5000);
    });

    socket.on("stop-tracking", (carToBeUntracked) => {
        clearInterval(trackIntervalId);
        carToBeUntracked &&
            console.log(`Stopped tracking car with PN (${carToBeUntracked})`);
    });

    socket.on("disconnect", () => {
        clearInterval(trackIntervalId);
        console.log("Client disconnected");
        console.log("Number of connected clients: ", io.engine.clientsCount);
    });
});

app.use(carRoutes);

sequelize
    .sync({ alter: true })
    .then(() => {
        httpServer.listen(PORT, () => {
            console.log(`Server is up and running on port ${[PORT]}`);
        });
    })

    .catch((err) => {
        console.log(err);
    });

exports.io = io;
