import express from "express";
import http from "http";
import { Socket, Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {origin : '*'}
});

const port = 8080; // default port to listen

let users = [];
const messages = {
  general : [],
  random : [],
  jokes : [],
  TYPEscript : []
}


io.on('connection', (socket) => {
        // tslint:disable-next-line:no-console
        console.log('a user connected');

    socket.on('join server', (username) => {
          // tslint:disable-next-line:no-console
          console.log("new user");
          const user = {
            username, 
            id: socket.id,
          }
          users.push(user);
          io.emit("new user", users);
    });

    socket.on('join room', (roomName, cb) => {
      // tslint:disable-next-line:no-console
      console.log("room join");
      socket.join(roomName);
      cb(messages[roomName]);
    });
    
    socket.on('send message', ({content, to, sender, chatName, isChannel}) => {
      // tslint:disable-next-line:no-console
      //console.log(message);

      if(isChannel) {
        const payload = {
          content, 
          chatName,
          sender,
        };
        socket.to(to).emit("new message", payload);
      } else {
        const payload = {
          content, 
          chatName : sender,
          sender,
        };
        socket.to(to).emit("new message", payload);
      }
      if(messages[chatName]) {
        messages[chatName].push({
          sender, 
          content
        });
      }
    });


  socket.on('disconnect', () => {
        // tslint:disable-next-line:no-console
        console.log('a user disconnected!');
        users = users.filter(u => u.id !== socket.id);
        io.emit("new user", users);
  });
});

server.listen(port, () => {
 // tslint:disable-next-line:no-console
  console.log(`listening on port ${port}`)
});




































/*
// define a route handler for the default home page

  io.on('connection', (socket:Socket) => {
    socket.on("join", (arg, callback) => {
        // tslint:disable-next-line:no-console
        console.log(arg);
        callback("got it");
        socket.join("some room");
        io.to("some room").emit("some event");
      });
  });
// start the Express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
} );
*/