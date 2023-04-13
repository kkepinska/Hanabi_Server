"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var random = require('lodash.random');
var app = (0, express_1.default)();
var server = http_1.default.createServer(app);
var io = new socket_io_1.Server(server, {
    cors: { origin: '*' }
});
var port = 8080; // default port to listen
function getId() {
    return random(0, 1000);
}
var userNames = [];
io.on('connection', function (socket) {
    // tslint:disable-next-line:no-console
    console.log('a user connected');
    socket.on('createRoom', function (isPublic) {
        // tslint:disable-next-line:no-console
        console.log(isPublic);
        var roomInfo = {
            id: getId(),
            playerCount: 0,
            players: [],
            isPublic: isPublic,
        };
        io.emit('newRoom', roomInfo);
    });
    socket.on('disconnect', function () {
        // tslint:disable-next-line:no-console
        console.log('a user disconnected!');
    });
    socket.on("login", function (userName) {
        console.log('login');
        console.log(userName);
        if (userNames.find(function (name) { return name === userName; }) != undefined) {
            io.emit("login", "INVALID");
            console.log('login invalid');
        }
        else {
            userNames.push(userName);
            io.emit("login", "VALID");
            console.log('login valid');
        }
    });
});
server.listen(port, function () {
    // tslint:disable-next-line:no-console
    console.log("listening on port ".concat(port));
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
