const express = require("express");
const sequelize = require("./utils/db");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");

const carRoutes = require("./routes/car");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  if (req.io) next();
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  console.log("New Client connected with id", socket.id);
});

app.use(carRoutes);

sequelize
  .sync()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server is up and running on port ${[PORT]}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
