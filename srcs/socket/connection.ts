import { Socket } from "socket.io";
import { Client } from "../models/client.model."
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export const handleConnection = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    const client:Client = new Client(socket);

    socket.on('message', client.receiveMessage);

    socket.on('disconnect', () => {
      console.log('A user disconnected from the WebSocket');
    });
}