"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
const game_model_1 = require("./game.model");
class Queue {
    constructor() { }
    ;
    static addClient(client) {
        this.waitingPlayer.push(client);
        client.setInQueue(true);
        console.log("Adding a client");
        if (this.waitingPlayer.length >= 2)
            this.launchGame();
    }
    static removeClient(client) {
        for (let i = 0; i < this.waitingPlayer.length; i++) {
            if (this.waitingPlayer[i].isEqual(client)) {
                this.waitingPlayer.splice(i, 1);
                return;
            }
        }
    }
    static launchGame() {
        console.log("Starting game");
        //instance of Game is saved in Player class in constructor
        new game_model_1.Game(this.waitingPlayer[0], this.waitingPlayer[1]);
        //deleting first 2 players from waiting list
        this.waitingPlayer.splice(0, 2);
    }
}
exports.Queue = Queue;
Queue.waitingPlayer = [];
