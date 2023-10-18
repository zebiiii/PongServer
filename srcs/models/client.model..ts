import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Game } from "./game.model";
import { Queue } from "./queue.model";
require('dotenv').config();

export class Client {
    private id: string;
    private socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
	private functionMap = new Map<string, (m:string[]) => void>();
	private currentGame: (Game | null) = null;

	private barY = Number(process.env.PLAYGROUND_HEIGHT) / 2;
	private score: number = 0;

    constructor(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
      	this.id = socket.id;
      	this.socket = socket;

		this.initializeMap();
    }

	public setCurrentGame(game: Game)
	{
		if (this.currentGame) throw new Error("Trying to set a currentGame to a client that already has one");
		this.currentGame = game;
	}

	public getId():string {return this.id};

	public getBarY():number {return this.barY};

	public getScore():number {return this.score};


	public increaseScore() {
		this.score++;
	}

	public isEqual(client: Client): boolean {
		return (client.getId() === this.id)
	}

	private initializeMap()
	{
		this.functionMap.set("SET_STATUS", this.setStatus);
		this.functionMap.set("SET_BAR", this.setBar);
	}
  
    public send(type:string, message: string) {
      	this.socket.emit(type, message);
    }

    public sendBallPosition(pos: {x:number, y:number}) {
      	if (!pos.x || !pos.y) throw new TypeError("Ball x and y position must be set.");
      	this.socket.emit("ballPosition", JSON.stringify(pos));
    }

    public receiveMessage(message:string) {
		const words = message.split(' ');

		if (!words[0]) return;

		const func = this.functionMap.get(words[0]);
		if (func) 
		  func(words);
    }

	private setStatus(message:string[]) {
		if (message[1] === "WAITING")
			Queue.addClient(this);
		if (message[1] === "IDLE")
			Queue.removeClient(this);
	}

	private setBar(message:string[]) {
		if (!message[1]) return;
		const playGroundHeight = Number(process.env.PLAYGROUND_HEIGHT);

		let newY = Number(message[1]);
		if (newY < 0 || newY >= playGroundHeight) return;
		this.barY = newY;
	}
}
