const { Server } = require('socket.io');
const commentHandler = require('./commentHandler');
const roomHandler = require('./roomHandler');

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Gắn các handler vào từng socket connection
    roomHandler(io, socket);
    commentHandler(io, socket);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;  // Return để app dùng (set vào app nếu cần)
};
