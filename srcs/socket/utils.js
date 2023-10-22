"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getConnectedClient = (io) => {
    return Object.keys(io.sockets.sockets);
};
