const express = require("express");
const app = express();
const path = require("path");
const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 5000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const NEW_SCORE_MESSAGE_EVENT = "newScoreMessage";
const NEW_HIGH_SCORES_MESSAGE_EVENT = "newHighScoresMessage";
let TOP_TEN_SCORES = [];

//production mode
if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.resolve(__dirname, "../client/build")));
  app.get("/*", (_request, response) => {
    response.sendFile(path.resolve(__dirname, "../client/build/index.html"));
  });
} else {
  //build mode
  //Static file declaration
  app.use(express.static(path.resolve(__dirname, "../client/build")));
  app.get("/*", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/public/index.html"));
  });
}

io.on("connection", (socket) => {
  // Join a conversation
  const { roomId } = socket.handshake.query;
  socket.join(roomId);

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
  });

  // Listen for new scores
  socket.on(NEW_SCORE_MESSAGE_EVENT, (data) => {
    let replacedScore = false;
    const noDuplicateTopTen = TOP_TEN_SCORES.map((score) => {
      if (score.senderId === data.senderId && score.body < data.body) {
        replacedScore = true;
        return data;
      }
      return score;
    });
    if (!replacedScore) {
      noDuplicateTopTen.push(data);
    }
    noDuplicateTopTen.sort((a, b) => b.body - a.body);
    const newTopTen = noDuplicateTopTen.slice(0, 10);
    TOP_TEN_SCORES = [...newTopTen];
    // Emit message with the best scores in order
    io.in(roomId).emit(NEW_HIGH_SCORES_MESSAGE_EVENT, TOP_TEN_SCORES);
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    socket.leave(roomId);
  });
});

//start server
server.listen(PORT, () => {
  console.log(`server listening on port: ${PORT}`);
});
