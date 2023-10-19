import { Client } from "./client.model.";
require('dotenv').config();

export class Game {
    private player1: Client;
    private player2: Client;
    private ball: Ball;

    private playGroundHeight = Number(process.env.PLAYGROUND_HEIGHT);
    private playGroundWidth = Number(process.env.PLAYGROUND_WIDTH);
    private barHeight = 100;
    private barWidth = 10;

    //50ms for 20 ticks per seconds
    private updateInterval = 50;
    private loop: (NodeJS.Timeout | null) = null;

    constructor(player1: Client, player2: Client) {
        this.player1 = player1;
        this.player2 = player2;
        this.ball = new Ball(0, 0);

        player1.setCurrentGame(this);
        player2.setCurrentGame(this);

        this.startNewRound();
    };

    public stop()
    {
        if (this.loop)
            clearInterval(this.loop);
        this.player1.resetCurrentGame();
        this.player2.resetCurrentGame();
    }

    private startNewRound()
    {
        //reset tick loop
        if (this.loop)
            clearInterval(this.loop);
        this.ball = new Ball(0, 0);

        this.startActualize();
    }

    private startActualize()
    {
        this.loop = setInterval(() => {
            this.maybeBallTakeBar();
            this.maybeBallTakeWall();
            this.maybeBallOut();

            this.ball.actualize();
        }, this.updateInterval);
    }

    private maybeBallTakeWall()
    {
        if (this.ball.getY() >= this.playGroundHeight
            || this.ball.getY() <= 0)
            this.ball.takeWall();
    }

    private maybeBallTakeBar()
    {
        const playGroundWidth = Number(process.env.PLAYGROUND_WIDTH);
        
        //Condition for ball touching bar:
        //X: bar x is greater than (playGroundWidth - this.barWidth) or less than (this.barWidth)
        //Y: Absolute value of BallY - BarY is less than (BarHeight / 2)
        if ( this.ball.getY() >= (playGroundWidth - this.barWidth)
            && (Math.abs(this.player2.getBarY() - this.ball.getY()) <= (this.barHeight / 2)))
            this.ball.takeBar();

        if ( this.ball.getY() <= this.barWidth
            && (Math.abs(this.player1.getBarY() - this.ball.getY()) <= (this.barHeight / 2)))
            this.ball.takeBar();
    }

    private maybeBallOut()
    {
        const playGroundWidth = Number(process.env.PLAYGROUND_WIDTH);

        //Check if ball still in the playground
        if (this.ball.getX() <= playGroundWidth && this.ball.getX() >= 0) return;

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

class Ball {
    private x: number;
    private y: number;
    private xSpeed = 1;
    private ySpeed = 1;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public actualize()
    {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }

    public getX(): number {
        return (this.x);
    }

    public getY(): number {
        return (this.y);
    }

    public takeWall()
    {
        this.y = -this.y;
    }

    public takeBar()
    {
        this.x = -this.x;
        this.y = -this.y;
    }
}