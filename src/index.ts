import express from "express";
import http from "http";
import { Socket, Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {origin : '*'}
});

const port = 8080; // default port to listen


io.on('connection', (socket) => {
        // tslint:disable-next-line:no-console
        console.log('a user connected');

  socket.on('message', (message) => {
        // tslint:disable-next-line:no-console
        console.log(message);
    io.emit('message', `${socket.id.substr(0, 2)} said ${message}`);
  });

  socket.on('disconnect', () => {
        // tslint:disable-next-line:no-console
        console.log('a user disconnected!');
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