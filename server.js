const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { generateMaze } = require("./mazeUtils");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const COLORS = [
  "#3498db", "#9b59b6", "#e67e22", "#f1c40f", "#1abc9c", "#8e44ad", "#2980b9",
  "#e91e63", "#00cec9", "#6c5ce7", "#fdcb6e", "#0984e3", "#a29bfe", "#fab1a0",
  "#ffeaa7", "#81ecec"
];
let colorIndex = 0;

const rooms = {};

function getMazeSize(difficulty) {
  switch (difficulty) {
    case "medium": return { rows: 45, cols: 45 };
    case "hard": return { rows: 61, cols: 61 };
    case "extreme": return { rows: 81, cols: 81 };
    default: return { rows: 31, cols: 31 };
  }
}

function shouldAutoStart(room) {
  const players = Object.values(room.players);
  const readyCount = players.filter((p) => p.isReady).length;
  const thresholdRaw = room.settings.autoStartThreshold;

  // Obsługa wartości procentowych np. "75%"
  if (typeof thresholdRaw === "string" && thresholdRaw.endsWith("%")) {
    const percent = parseInt(thresholdRaw.replace("%", ""));
    const required = Math.ceil((percent / 100) * players.length);
    return readyCount >= required;
  }

  // Obsługa wartości liczbowych jako string lub number
  const threshold = parseInt(thresholdRaw, 10);
  if (!isNaN(threshold)) {
    return readyCount >= threshold;
  }

  return false;
}


io.on("connection", (socket) => {
  
  socket.on("joinRoom", ({ roomId, name, difficulty }) => {
    socket.roomId = roomId;

if (!rooms[roomId]) {
  rooms[roomId] = {
    players: {},
    ownerId: socket.id,
    gameStarted: false,
    mazeData: null,
    settings: {
      difficulty,
      restartDelay: 15,
      maxPlayers: 16,
      autoStartThreshold: "75%",
      finishThreshold: "100%",
      chatEnabled: true,
      autoRestart: true,
      scoringType: "points",
      maxRoundTime: 120,
    },
  };
}

    const room = rooms[roomId];
    if (room && Object.keys(room.players).length >= room.settings.maxPlayers) {
  socket.emit("roomFull", { message: "Room is full" });
  return;
}
    const color = COLORS[colorIndex % COLORS.length];
    colorIndex++;

    const playerData = {
      x: 0,
      y: 0,
      color,
      nick: name || `Player${colorIndex}`,
      isOwner: socket.id === room.ownerId,
      isReady: false,
      finishTime: null,
      movement: "arrows",
    };

    room.players[socket.id] = playerData;
    socket.join(roomId);

    const maze = room.mazeData?.maze || null;
    const startX = room.mazeData?.startX ?? 0;
    const startY = room.mazeData?.startY ?? 0;
    const finishX = room.mazeData?.finishX ?? 0;
    const finishY = room.mazeData?.finishY ?? 0;

socket.emit("init", {
  id: socket.id,
  players: room.players,
  maze,
  startX,
  startY,
  finishX,
  finishY,
  settings: room.settings, // 👈 TO JEST KLUCZOWE!
});


    socket.to(roomId).emit("newPlayer", { id: socket.id, pos: playerData });

    socket.on("move", (pos) => {
      if (room.players[socket.id]) {
        room.players[socket.id] = { ...room.players[socket.id], ...pos };
        socket.to(roomId).emit("update", {
          id: socket.id,
          pos: room.players[socket.id],
        });
      }
    });

    socket.on("playerReady", () => {
      if (room.players[socket.id]) {
        room.players[socket.id].isReady = true;
        io.to(roomId).emit("update", {
          id: socket.id,
          pos: room.players[socket.id],
        });
      }

      if (!room.gameStarted && shouldAutoStart(room)) {
        room.gameStarted = true;
        const serverStart = Date.now() + 3000;
        io.to(roomId).emit("startGame", { serverStart });
      }
    });

    socket.on("startGameByOwner", () => {
      if (room.ownerId !== socket.id || room.gameStarted) return;
      room.gameStarted = true;
      const serverStart = Date.now() + 3000;
      io.to(roomId).emit("startGame", { serverStart });
    });

    socket.on("playerFinished", ({ time }) => {
      if (room.players[socket.id]) {
        room.players[socket.id].finishTime = time;
        io.to(roomId).emit("update", {
          id: socket.id,
          pos: room.players[socket.id],
        });
      }
    });

    socket.on("getServerTime", (cb) => {
      cb({ now: Date.now() });
    });

    socket.on("changeSettings", (newSettings) => {
      if (socket.id !== room.ownerId) return;

      room.settings = { ...room.settings, ...newSettings };
      io.to(roomId).emit("settingsUpdated", room.settings);
    });

    socket.on("changeMovement", (mode) => {
      if (!["arrows", "wasd"].includes(mode)) return;
      if (room.players[socket.id]) {
        room.players[socket.id].movement = mode;
        socket.emit("movementUpdated", {
          id: socket.id,
          movement: mode,
        });
      }
    });

    socket.on("changeColor", (newColor) => {
      const room = rooms[socket.roomId];
      if (!room || !room.players[socket.id]) return;
    
      const usedColors = Object.values(room.players)
        .filter(p => p.color && p.color !== room.players[socket.id].color)
        .map(p => p.color.toLowerCase());
    
      if (usedColors.includes(newColor.toLowerCase())) return;
    
      room.players[socket.id].color = newColor;
    
      io.to(socket.roomId).emit("update", {
        id: socket.id,
        pos: room.players[socket.id],
      });
    });
    

socket.on("chatMessage", ({ roomId, nick, message }) => {
  const resolvedRoomId = roomId || socket.roomId;
  const room = rooms[resolvedRoomId];

  if (!room || room.settings.chatEnabled === false) return;


  io.to(resolvedRoomId).emit("chatMessage", {
    id: socket.id,
    nick,
    message,
    timestamp: Date.now(),
  });
});



    socket.on("newGame", () => {
      if (room.ownerId !== socket.id) return;

      const { difficulty } = room.settings;
      const { rows, cols } = getMazeSize(difficulty);
      const mazeData = generateMaze(rows, cols);
      room.mazeData = mazeData;
      room.gameStarted = false;

      const { maze, startX, startY, finishX, finishY } = mazeData;

      for (const id in room.players) {
        room.players[id] = {
          ...room.players[id],
          x: startX,
          y: startY,
          isReady: false,
          finishTime: null,
        };
      }

io.to(roomId).emit("init", {
  id: socket.id,
  players: room.players,
  maze,
  startX,
  startY,
  finishX,
  finishY,
  settings: room.settings, // ✅ DODAJ TO!
});
    });

    socket.on("leaveRoom", () => {
      handlePlayerLeave(socket, roomId);
    });

    socket.on("disconnect", () => {
      handlePlayerLeave(socket, roomId);
    });
  });

  function handlePlayerLeave(socket, roomId) {
    const room = rooms[roomId];
    if (!room || !room.players[socket.id]) return;

    delete room.players[socket.id];
    io.to(roomId).emit("removePlayer", socket.id);

    if (room.ownerId === socket.id) {
      const nextOwner = Object.keys(room.players)[0];
      room.ownerId = nextOwner;
      if (nextOwner && room.players[nextOwner]) {
        room.players[nextOwner].isOwner = true;
        io.to(roomId).emit("update", {
          id: nextOwner,
          pos: room.players[nextOwner],
        });
      }
    }

    if (Object.keys(room.players).length < 2) {
      room.gameStarted = false;
    }

    socket.leave(roomId);
  }
});

server.listen(3001, () => {
  console.log("✅ Server running on http://localhost:3001");
});
