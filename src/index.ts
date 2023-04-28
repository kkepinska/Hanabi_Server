import express from "express";
import http from "http";
import { Socket, Server } from "socket.io";
import { RoomInfo } from "./RoomInfo";
import _ from "lodash";
import { rootCertificates } from "tls";
import { Game } from "./table";
import { Gamestate } from "./Gamestate";
import { Card } from "./Card";

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
const currentGames: Map<number, Gamestate> = new Map<number, Game>();

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
    socket.join(roomId.toString());
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

  socket.on('startGame', ({ gameId }) => {
    // tslint:disable-next-line:no-console
    console.log(gameId);
    let newGame = new Game(3, 5)
    currentGames.set(gameId, newGame)
    io.to(gameId.toString()).emit('startGame', newGame);
    // tslint:disable-next-line:no-console
    console.log("Someone is starting a game");
  })

  socket.on('playCard', ({ hand, card, gameId }) => {
    // tslint:disable-next-line:no-console
    console.log(gameId);
     // tslint:disable-next-line:no-console
     console.log(hand, card);
    currentGames.get(gameId).playAction({ player: hand, position: card})
    io.to(gameId.toString()).emit('update', currentGames.get(gameId));
    // tslint:disable-next-line:no-console
    console.log("Card played");
  })

});

server.listen(port, () => {
 // tslint:disable-next-line:no-console
  console.log(`listening on port ${port}`)
});
