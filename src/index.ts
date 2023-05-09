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
      io.to(roomId.toString()).emit('updateRoom', roomInfo)
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

  socket.on('startGame', ( gameId: number ) => {
    // tslint:disable-next-line:no-console
    console.log(gameId);

    let room = roomsMap.get(gameId)
    let newGame = new Game(room.players, 5)
    currentGames.set(gameId, newGame)

    let entriesArray = Array.from(newGame.hands.entries())
    io.to(gameId.toString()).emit('startGame', [newGame, entriesArray]);

    // tslint:disable-next-line:no-console
    console.log("Someone is starting a game");
        // tslint:disable-next-line:no-console
        console.log(newGame);
        console.log("______________")
        console.log(entriesArray)
  })

  socket.on('playCard', (player: string, cardIdx: number, gameId: number) => {
    // tslint:disable-next-line:no-console
    console.log(gameId);
     // tslint:disable-next-line:no-console
    console.log(player, cardIdx);

    let game = currentGames.get(gameId);
    game.playAction({ player: player, position: cardIdx })

    let entriesArray = Array.from(game.hands.entries());
    io.to(gameId.toString()).emit('update', [game, entriesArray]);

    // tslint:disable-next-line:no-console
    console.log("Card played");
  })

  socket.on('discardCard', (player: string, cardIdx: number, gameId: number) => {
    let game = currentGames.get(gameId);
    game.discardAction({ player: player, position: cardIdx })

    let entriesArray = Array.from(game.hands.entries());
    io.to(gameId.toString()).emit('update', [game, entriesArray]);

    // tslint:disable-next-line:no-console
    console.log("Card discarded");
  })

  socket.on('hintCard', (player: string, receiver: string, 
    hintType: ("rank" | "color"), hintValue: number, gameId: number) => {
    let game = currentGames.get(gameId);
    game.hintAction({ 
      type: hintType,
      value: hintValue,
      giver: player, 
      receiver: receiver
    })

    let entriesArray = Array.from(game.hands.entries());
    io.to(gameId.toString()).emit('update', [game, entriesArray]);

    // tslint:disable-next-line:no-console
    console.log("Card hinted");
  })

});


server.listen(port, () => {
 // tslint:disable-next-line:no-console
  console.log(`listening on port ${port}`)
});
