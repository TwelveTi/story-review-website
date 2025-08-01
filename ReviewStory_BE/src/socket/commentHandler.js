module.exports = (io, socket) => {
  socket.on('join_review_comment', (reviewID) => {
    const roomId = `review_comment_${reviewID}`;
    console.log(`Socket ${socket.id} joined Room ${roomId}`);
    socket.join(roomId);
  });

  socket.on('leave_review_comment', (reviewID) => {
    const roomId = `review_comment_${reviewID}`;
    console.log(`Socket ${socket.id} left Room ${roomId}`);
    socket.leave(roomId);
  });
};
