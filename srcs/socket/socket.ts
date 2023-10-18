import { Server } from 'socket.io';
import { handleConnection  } from './connection';
import http from 'http';

const server = http.createServer();
const io = new Server(server);

const initialize = () => {
  io.on('connection', handleConnection);
  
  server.listen(4000, () => {});
}