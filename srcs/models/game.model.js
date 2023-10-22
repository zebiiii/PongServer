"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
require('dotenv').config();
class Game {
    constructor(player1, player2) {
        this.playGroundHeight = Number(process.env.PLAYGROUND_HEIGHT);
        this.playGroundWidth = Number(process.env.PLAYGROUND_WIDTH);
        this.barHeight = 100;
        this.barWidth = 10;
        //50ms for 20 ticks per seconds
        this.updateInterval = 50;
        this.loop = null;
        this.player1 = player1;
        this.player2 = player2;
        this.ball = new Ball(0, 0);
        player1.setCurrentGame(this);
        player2.setCurrentGame(this);
        this.startNewRound();
    }
    ;
    stop() {
        if (this.loop)
            clearInterval(this.loop);
        this.player1.resetCurrentGame();
        this.player2.resetCurrentGame();
    }
    startNewRound() {
        //reset tick loop
        if (this.loop)
            clearInterval(this.loop);
        this.ball = new Ball(0, 0);
        this.startActualize();
    }
    startActualize() {
        this.loop = setInterval(() => {
            this.maybeBallTakeBar();
            this.maybeBallTakeWall();
            this.maybeBallOut();
            this.ball.actualize();
            console.log("Updating ball pose");
            this.player1.sendBallPosition(this.ball.getPosition());
            this.player2.sendBallPosition(this.ball.getPosition());
        }, this.updateInterval);
    }
    maybeBallTakeWall() {
        if (this.ball.getY() >= this.playGroundHeight
            || this.ball.getY() <= 0)
            this.ball.takeWall();
    }
    maybeBallTakeBar() {
        const playGroundWidth = Number(process.env.PLAYGROUND_WIDTH);
        //Condition for ball touching bar:
        //X: bar x is greater than (playGroundWidth - this.barWidth) or less than (this.barWidth)
        //Y: Absolute value of BallY - BarY is less than (BarHeight / 2)
        if (this.ball.getY() >= (playGroundWidth - this.barWidth)
            && (Math.abs(this.player2.getBarY() - this.ball.getY()) <= (this.barHeight / 2)))
            this.ball.takeBar();
        if (this.ball.getY() <= this.barWidth
            && (Math.abs(this.player1.getBarY() - this.ball.getY()) <= (this.barHeight / 2)))
            this.ball.takeBar();
    }
    maybeBallOut() {
        const playGroundWidth = Number(process.env.PLAYGROUND_WIDTH);
        //Check if ball still in the playground
        if (this.ball.getX() <= playGroundWidth && this.ball.getX() >= 0)
            return;
        //Check who got the point
        //If ball exit left its p2
        //if ball exit right its p1
        if (this.ball.getX() >= playGroundWidth)
            this.player1.increaseScore();
        if (this.ball.getX() <= 0)
            this.player2.increaseScore();
        this.startNewRound();
    }
}
exports.Game = Game;
class Ball {
    constructor(x, y) {
        this.xSpeed = 1;
        this.ySpeed = 1;
        this.x = x;
        this.y = y;
    }
    actualize() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }
    getX() {
        return (this.x);
    }
    getY() {
        return (this.y);
    }
    getPosition() {
        return ({ x: this.x, y: this.y });
    }
    takeWall() {
        this.y = -this.y;
    }
    takeBar() {
        this.x = -this.x;
        this.y = -this.y;
    }
}
