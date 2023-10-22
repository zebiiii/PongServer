"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = void 0;
const socket_io_1 = require("socket.io");
const connection_1 = require("./connection");
const http_1 = __importDefault(require("http"));
require('dotenv').config();
const server = http_1.default.createServer();
const initialize = () => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    const port = Number(process.env.SOCKET_PORT);
    console.log("initialize socket on port: " + port);
    io.on('connection', connection_1.handleConnection);
    server.listen(port);
};
exports.initialize = initialize;
