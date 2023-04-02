"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: { origin: '*' }
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
    console.log(`listening on port ${port}`);
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
//# sourceMappingURL=index.js.map