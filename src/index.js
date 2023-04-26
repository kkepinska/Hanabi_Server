"use strict";
exports.__esModule = true;
var express_1 = require("express");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var lodash_1 = require("lodash");
//import { Game } from "./table";jnn
var app = (0, express_1["default"])();
var server = http_1["default"].createServer(app);
var io = new socket_io_1.Server(server, {
    cors: { origin: '*' }
});
var port = 8080; // default port to listen
function getId() {
    return lodash_1["default"].random(0, 1000);
}
function hasPlayer(room, player) {
    return room.players.indexOf(player) !== -1;
}
function addPlayer(room, player) {
    room.players.push(player);
    room.playerCount++;
}
var userNames = [];
var roomsMap = new Map();
//const currentGames: Map<number, Game> = new Map<number, Game>();
io.on('connection', function (socket) {
    // tslint:disable-next-line:no-console
    console.log('a user connected');
    socket.on('fetchAllRooms', function () {
        // tslint:disable-next-line:no-console
        console.log("fetching all rooms");
        io.emit('fetchAllRooms', Array.from(roomsMap.values()));
    });
    socket.on('createRoom', function (isPublic) {
        // tslint:disable-next-line:no-console
        console.log(isPublic);
        var roomId = getId();
        var roomInfo = {
            id: roomId,
            playerCount: 0,
            players: [],
            isPublic: isPublic
        };
        roomsMap.set(roomId, roomInfo);
        io.emit('newRoom', roomInfo);
    });
    socket.on('joinRoom', function (roomId, player) {
        // tslint:disable-next-line:no-console
        console.log("roomId in joinRoom:" + roomId);
        console.log("rooms ids: " + Array.from(roomsMap.keys()));
        var roomInfo = roomsMap.get(roomId);
        if (!hasPlayer(roomInfo, player)) {
            addPlayer(roomInfo, player);
            io.emit('joinRoom', roomInfo);
        }
    });
    socket.on('disconnect', function () {
        // tslint:disable-next-line:no-console
        console.log('a user disconnected!');
    });
    socket.on("login", function (userName) {
        console.log('login');
        console.log(userName);
        if (userNames.find(function (name) { return name === userName; }) != undefined) {
            io.emit("login", ["INVALID", userName]);
            console.log('login invalid');
        }
        else {
            userNames.push(userName);
            io.emit("login", ["VALID", userName]);
            console.log('login valid');
        }
    });
    /*
      socket.on('startGame', ({ gameId }) => {
        let newGame = new Game(3, 5)
        currentGames.set(gameId, newGame)
        io.to(gameId).emit('startGame', newGame.currentScore);
        console.log("Someone is starting a game");
      })
    
      socket.on('gameUpdate', ({ gameId, action }) => {
        io.to(gameId).emit(gameId, action);
      })
      */
});
server.listen(port, function () {
    // tslint:disable-next-line:no-console
    console.log("listening on port ".concat(port));
});
