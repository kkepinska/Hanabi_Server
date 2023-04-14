import express from "express";
import http from "http";
import { Socket, Server } from "socket.io";
import { RoomInfo } from "./RoomInfo";
import _ from "lodash";
import { rootCertificates } from "tls";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {origin : '*'}
});

const port = 8080; // default port to listen

function getId(): number {
  return _.random(0, 1000)
}

function hasPlayer(room: RoomInfo, player: string): boolean {
  return room.players.indexOf(player) !== -1
}

function addPlayer(room: RoomInfo, player: string): void {
  room.players.push(player)
  room.playerCount++
}

const userNames: string[] = [];
const roomsMap:  Map<number, RoomInfo> = new Map<number, RoomInfo>();

io.on('connection', (socket) => {
  // tslint:disable-next-line:no-console
  console.log('a user connected');

  socket.on('fetchAllRooms', () => {
    // tslint:disable-next-line:no-console
    console.log("fetching all rooms");
    io.emit('fetchAllRooms', Array.from(roomsMap.values()));
  });

  socket.on('createRoom', (isPublic: boolean) => {
    // tslint:disable-next-line:no-console
    console.log(isPublic);
    const roomId = getId()
    var roomInfo : RoomInfo = {
      id: roomId,
      playerCount: 0,
      players: [],
      isPublic : isPublic,
    }
    roomsMap.set(roomId, roomInfo)
    io.emit('newRoom', roomInfo);
  });

  socket.on('joinRoom', (roomId: number, player: string) => {
    // tslint:disable-next-line:no-console
    console.log("roomId in joinRoom:" + roomId);
    console.log("rooms ids: " + Array.from(roomsMap.keys()))
    const roomInfo = roomsMap.get(roomId)
    if (!hasPlayer(roomInfo, player)) {
      addPlayer(roomInfo, player)
      io.emit('joinRoom', roomInfo);
    }
  });

  socket.on('disconnect', () => {
        // tslint:disable-next-line:no-console
        console.log('a user disconnected!');
  });

  socket.on("login", (userName: string) => {
    console.log('login');
    console.log(userName);
    if (userNames.find(name => name === userName) != undefined) {
      io.emit("login", ["INVALID", userName])
      console.log('login invalid');
    } else {
      userNames.push(userName)
      io.emit("login", ["VALID", userName])
      console.log('login valid');
    }
  })
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