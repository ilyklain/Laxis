import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { RoomManager } from './RoomManager';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for development
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;
const roomManager = new RoomManager();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId: string, name: string) => {
    roomManager.addUser(socket.id, name, roomId);
    socket.join(roomId);
    
    const usersInRoom = roomManager.getUsersInRoom(roomId);
    
    // Notify others in the room
    socket.to(roomId).emit('user-connected', {
      userId: socket.id,
      name
    });

    // Send current participants to the joining user
    socket.emit('room-users', usersInRoom.filter(u => u.id !== socket.id));
  });

  socket.on('signal', (data: { to: string, signal: any }) => {
    io.to(data.to).emit('signal', {
      from: socket.id,
      signal: data.signal
    });
  });

  socket.on('send-message', (data: { roomId: string, message: string }) => {
    const user = roomManager.getUser(socket.id);
    if (user) {
      io.to(data.roomId).emit('chat-message', {
        userId: socket.id,
        name: user.name,
        message: data.message,
        timestamp: Date.now()
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    const user = roomManager.removeUser(socket.id);
    if (user) {
      socket.to(user.roomId).emit('user-disconnected', socket.id);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
