"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleConnection = void 0;
const client_model_1 = require("../models/client.model.");
const handleConnection = (socket) => {
    console.log("new Client !");
    const client = new client_model_1.Client(socket);
    //bind to avoid loose context
    socket.on('message', client.receiveMessage.bind(client));
    socket.on('disconnect', client.disconnect.bind(client));
};
exports.handleConnection = handleConnection;
