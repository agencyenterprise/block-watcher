const { Server } = require('socket.io')

const io = new Server(3000, {
  cors: '*',
});

io.on("connection", (socket) => {
  socket.join('current-contract')
});

module.exports = io