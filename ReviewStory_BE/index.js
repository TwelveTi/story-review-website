require("dotenv").config();
const express = require("express");
const route = require("./src/routes/index");
const connectDB = require("./src/utils/connectDB"); 
const cors = require('cors');
const http = require('http');
const socketSetup = require('./src/socket');

const app = express();
const server = http.createServer(app);

// Init Socket.IO và attach vào app
const io = socketSetup(server);
app.set('io', io);

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Init routes
route(app);

// Kết nối DB và start server
connectDB().then(() => {
  const port = process.env.PORT || 3000;
  const hostname = process.env.HOST_NAME || "localhost";

  server.listen(port, hostname, () => {
    console.log(`Server đang chạy tại http://${hostname}:${port}`);
  });
});
