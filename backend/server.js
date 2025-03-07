import 'dotenv/config.js' 
import http from 'http'; 
import jwt from 'jsonwebtoken'
import app from './app.js'; // Import our Express app from app.js
import {Server} from 'socket.io'
import cors from 'cors'
import mongoose from 'mongoose';
import projectModel from './models/projectModel.js';


const PORT = process.env.PORT || 3000 // Set the port number from environment variables or default to 3000

const server = http.createServer(app); // Create an HTTP server using our Express app

const io =  new Server(server, {
  cors: {
    origin: "*"
  }
});


io.use(async(socket, next)=>{
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
    const projectId = socket.handshake.query.projectId;
    
    
    if(!token){
      return next(new Error('Authentication Error'))
    }
    if(!mongoose.Types.ObjectId.isValid(projectId)){
      return next(new Error('Inavlid ProjectId'))
    }

    socket.project = await projectModel.findById(projectId)

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded){
      return next(new Error('Authentication Error'))
    }
    
    socket.user = decoded;
    
    next();
    
  } catch (error) {
    next(error)
  }
})


io.on('connection', socket => {
    console.log('a user connected');

  socket.join(socket.project._id);
  socket.on('project-message', data=>{
    socket.broadcast.to(socket.project._id).emit('projectId')
  })  
  socket.on('event', data => { /* … */ });
  socket.on('disconnect', () => { /* … */ });
});



server.listen(PORT, ()=>{ // Start the server on the specified port
    console.log(`Server is running on port ${process.env.PORT}`); // Log a message when the server starts successfully
});