
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave ,getRoomUsers} = require('./utils/users');
const app = express();
const server = http.createServer(app);
const io = socketio(server);







// Set Static Folder 
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'LanChat Bot';
//Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom',({ username, room}) => {

       const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        //Broadcast to everyone else in the room that a new user has joined     
        socket.broadcast.to(user.room)
        .emit
        ('message', formatMessage(botName, `${user.username} has joined the chat`));
    }
    // Send users and room info
    
    );

  

    //Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to LanChat!'));



     

  


    
    //Listen for chat message           
    socket.on('chatMessage', msg => {
       const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
      //Runs when client disconnects  
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`));
        }
        
        
    });


})



const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

