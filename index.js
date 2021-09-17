const express = require("express");
const app = express();
var server = require("http").createServer(app);
const redis = require("redis");

const client = redis.createClient(6379, "134.209.144.84");
// Print redis errors to the console
client.on("error", (err) => {
  console.log("Error " + err);
});

var io = require("socket.io")(server, {
  cors: {
    origin: "http://143.110.178.216",
    credentials: true,
  },
  allowEIO3: true,
});
const port = process.env.PORT || 3000;
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

io.sockets.on("connection", (socket) => {
  socket.on("score", (data) => {
    socket.join(data);
    send_score(data);
  });
});

function send_score(id) {
  //@ send data
  client.get(`score_${id}`, (err, result) => {
    if (err) io.in(id).emit({ status: false });
    if (result) {
      var response = JSON.parse(result);
      if (response) {
        io.in(id).emit("score", response);
      } else {
        io.in(id).emit({ status: false });
      }
    }
  });
}

server.listen(port, () => {
  console.log(`Admin listening on port ${port}!`);
});
