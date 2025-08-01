module.exports = (io, socket) => {
  socket.on('join_room', (roomId) => {
    console.log(`Socket ${socket.id} joined Room ${roomId}`);
    socket.join(roomId);
  });

  socket.on('leave_room', (roomId) => {
    console.log(`Socket ${socket.id} left Room ${roomId}`);
    socket.leave(roomId);
  });
};
