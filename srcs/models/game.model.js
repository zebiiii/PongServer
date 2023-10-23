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
        this.ballSize = 15;
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
        console.log("Starting new round");
        //reset tick loop
        if (this.loop)
            clearInterval(this.loop);
        this.ball = new Ball(this.playGroundWidth / 2, this.playGroundHeight / 2);
        this.startActualize();
    }
    startActualize() {
        this.loop = setInterval(() => {
            this.maybeBallTakeBar();
            this.maybeBallTakeWall();
            this.maybeBallOut();
            this.ball.actualize();
            this.player1.sendBallPosition(this.ball.getPosition());
            this.player1.sendOpponentBarY(this.player2.getBarY());
            this.player2.sendBallPosition(this.getInvertedPosition(this.ball.getPosition()));
            this.player2.sendOpponentBarY(this.player1.getBarY());
        }, this.updateInterval);
    }
    getInvertedPosition(pos) {
        return ({
            x: this.getInvertedX(pos.x),
            y: pos.y
        });
    }
    getInvertedX(x) {
        const middleX = this.playGroundWidth / 2;
        return (2 * middleX - x);
    }
    maybeBallTakeWall() {
        if (this.ball.getY() >= (this.playGroundHeight - 10 - (this.ballSize / 2))
            || this.ball.getY() <= (10 + (this.ballSize / 2)))
            this.ball.takeWall();
    }
    maybeBallTakeBar() {
        //Condition for ball touching bar:
        //X: bar x is greater than (playGroundWidth - this.barWidth) or less than (this.barWidth)
        //Y: Absolute value of BallY - BarY is less than (BarHeight / 2)
        if (this.ball.getX() >= (this.playGroundWidth - this.barWidth - (this.ballSize / 2))
            && (Math.abs(this.player2.getBarY() - this.ball.getY()) <= (this.barHeight / 2)))
            this.ball.takeBar();
        if (this.ball.getX() <= (this.barWidth + (this.ballSize / 2))
            && (Math.abs(this.player1.getBarY() - this.ball.getY()) <= (this.barHeight / 2)))
            this.ball.takeBar();
    }
    maybeBallOut() {
        //Check if ball still in the playground
        if (this.ball.getX() <= this.playGroundWidth && this.ball.getX() >= 0)
            return;
        //Check who got the point
        //If ball exit left its p2
        //if ball exit right its p1
        if (this.ball.getX() >= this.playGroundWidth)
            this.player1.increaseScore();
        if (this.ball.getX() <= 0)
            this.player2.increaseScore();
        const newScoreP1 = {
            p1: this.player1.getScore(),
            p2: this.player2.getScore()
        };
        const newScoreP2 = {
            p1: this.player2.getScore(),
            p2: this.player1.getScore()
        };
        this.player1.sendScore(newScoreP1);
        this.player2.sendScore(newScoreP2);
        this.startNewRound();
    }
}
exports.Game = Game;
class Ball {
    constructor(x, y) {
        this.xSpeed = 10;
        this.ySpeed = 10;
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
        this.ySpeed = -this.ySpeed;
    }
    takeBar() {
        this.xSpeed = -this.xSpeed;
    }
}
