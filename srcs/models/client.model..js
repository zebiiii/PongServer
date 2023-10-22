"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const queue_model_1 = require("./queue.model");
require('dotenv').config();
class Client {
    constructor(socket) {
        this.currentGame = null;
        this.barY = Number(process.env.PLAYGROUND_HEIGHT) / 2;
        this.score = 0;
        this.inQueue = false;
        this.id = socket.id;
        this.socket = socket;
        this.functionMap = new Map();
        this.initializeMap();
    }
    getMap() {
        return (this.functionMap);
    }
    setCurrentGame(game) {
        if (this.currentGame)
            throw new Error("Trying to set a currentGame to a client that already has one");
        this.currentGame = game;
    }
    setInQueue(status) {
        this.inQueue = status;
    }
    resetCurrentGame() {
        this.currentGame = null;
        this.score = 0;
    }
    getId() { return this.id; }
    ;
    getBarY() { return this.barY; }
    ;
    getScore() { return this.score; }
    ;
    increaseScore() {
        this.score++;
    }
    isEqual(client) {
        return (client.getId() === this.id);
    }
    send(type, message) {
        this.socket.emit(type, message);
    }
    sendBallPosition(pos) {
        if (!pos.x || !pos.y)
            throw new TypeError("Ball x and y position must be set.");
        this.socket.emit("ballPosition", JSON.stringify(pos));
    }
    receiveMessage(message) {
        const words = message.split(' ');
        if (!words[0])
            return;
        const func = this.functionMap.get(words[0]);
        if (func)
            func(words);
    }
    initializeMap() {
        this.functionMap.set("SET_STATUS", this.setStatus.bind(this));
        this.functionMap.set("SET_BAR", this.setBar);
    }
    setStatus(message) {
        console.dir(this);
        if (message[1] === "WAITING")
            queue_model_1.Queue.addClient(this);
        if (message[1] === "IDLE")
            queue_model_1.Queue.removeClient(this);
    }
    setBar(message) {
        if (!message[1])
            return;
        const playGroundHeight = Number(process.env.PLAYGROUND_HEIGHT);
        let newY = Number(message[1]);
        if (newY < 0 || newY >= playGroundHeight)
            return;
        this.barY = newY;
    }
    disconnect() {
        console.log("Client disconnected");
        if (this.currentGame)
            this.currentGame.stop();
        if (this.inQueue)
            queue_model_1.Queue.removeClient(this);
    }
}
exports.Client = Client;
