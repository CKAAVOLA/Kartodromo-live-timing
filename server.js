
const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

const drivers = new Map();
let race = { running: false, startedAt: null };

io.on("connection", (socket) => {
  socket.emit("state", {
    drivers: [...drivers.values()],
    race
  });

  socket.on("driver:join", (data = {}) => {
    const id = String(data.id || socket.id);
    const driver = {
      id,
      socketId: socket.id,
      name: String(data.name || "Pilota"),
      kart: String(data.kart || "?"),
      lat: null,
      lng: null,
      accuracy: null,
      laps: [],
      bestLap: null,
      lastLap: null,
      lastCrossing: null,
      online: true
    };
    drivers.set(id, driver);
    socket.data.driverId = id;
    io.emit("state", { drivers: [...drivers.values()], race });
  });

  socket.on("driver:position", (data = {}) => {
    const id = socket.data.driverId;
    const d = drivers.get(id);
    if (!d) return;
    d.lat = Number(data.lat);
    d.lng = Number(data.lng);
    d.accuracy = Number(data.accuracy);
    io.emit("driver:position", {
      id,
      lat: d.lat,
      lng: d.lng,
      accuracy: d.accuracy
    });
  });

  socket.on("driver:lap", (data = {}) => {
    const id = socket.data.driverId;
    const d = drivers.get(id);
    if (!d) return;
    const lap = {
      lap: Number(data.lap || d.laps.length + 1),
      seconds: Number(data.seconds),
      at: Date.now()
    };
    if (!Number.isFinite(lap.seconds) || lap.seconds <= 0) return;
    d.laps.push(lap);
    d.lastLap = lap.seconds;
    d.bestLap = d.bestLap == null ? lap.seconds : Math.min(d.bestLap, lap.seconds);
    d.lastCrossing = lap.at;
    io.emit("driver:lap", { id, lap, bestLap: d.bestLap });
  });

  socket.on("race:start", () => {
    race = { running: true, startedAt: Date.now() };
    io.emit("race", race);
  });

  socket.on("race:stop", () => {
    race = { running: false, startedAt: null };
    io.emit("race", race);
  });

  socket.on("driver:leave", () => {
    const id = socket.data.driverId;
    if (id) drivers.delete(id);
    io.emit("state", { drivers: [...drivers.values()], race });
  });

  socket.on("disconnect", () => {
    const id = socket.data.driverId;
    const d = drivers.get(id);
    if (d) {
      d.online = false;
      io.emit("driver:offline", { id });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Kartodromo cronometraggio: http://localhost:${PORT}`);
});
