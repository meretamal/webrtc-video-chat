/* eslint-disable no-console */
import Koa from 'koa';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = new Koa();
export const httpServer = createServer(app.callback());
const io = new Server(httpServer);

io.on('connection', (socket) => {
  console.log(`Client ${socket.id} connected`);
});
