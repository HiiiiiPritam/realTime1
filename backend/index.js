// server.js
import express from 'express';
import http from 'http';
import {Server} from 'socket.io'

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow requests from your client origin
    methods: ["GET", "POST"]
  }
});


let players = {};

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);
  
  // Initialize a new player
  players[socket.id] = { x: 400, y: 300 }; // Start position
  
  // Notify other players of the new player
  socket.broadcast.emit('newPlayer', { id: socket.id, ...players[socket.id] });
  
  // Send existing players to the new player
  socket.emit('currentPlayers', players);

  // Handle player movement
  // socket.on('playerMove', (data) => {
  //   if (players[socket.id]) {
  //     players[socket.id].x = data.x;
  //     players[socket.id].y = data.y;
  //     socket.broadcast.emit('playerMoved', { id: socket.id, ...data });
  //   }
  // });

  // Handle player movement
socket.on('playerMove', (data) => {
  if (players[socket.id]) {  // Corrected from data.id to socket.id
      players[socket.id].x = data.x;
      players[socket.id].y = data.y;
      players[socket.id].direction = data.direction;

      // Broadcast the movement and direction to all other players
      socket.broadcast.emit('playerMoved', {
          id: socket.id,
          x: data.x,
          y: data.y,
          // direction: data.direction
      });
  }
});


  // Handle player disconnect
  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    delete players[socket.id];
    io.emit('playerDisconnected', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
