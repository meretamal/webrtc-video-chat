/* eslint-disable no-console */
import Koa from 'koa';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { Calls } from './interfaces/calls';
import { Call } from './interfaces/call';
import { generateId } from './utils/generate-id';

const app = new Koa();
export const httpServer = createServer(app.callback());
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const calls: Calls = {};

io.on('connection', (socket) => {
  console.log(`Client ${socket.id} connected`);

  socket.on('request-calls', () => {
    socket.emit('calls-sent', { calls: Object.values(calls) });
  });

  socket.on('create-call', ({ username }: { username: string }) => {
    const id = generateId();
    socket.join(id);
    const call: Call = {
      id,
      caller: username,
    };
    calls[id] = call;
    socket.emit('call-joined', call);
    socket.broadcast.emit('call-created', call);
  });

  socket.on('join-call', ({ id, callee }: { id: string, callee: string }) => {
    socket.join(id);
    const call = calls[id];
    call.callee = callee;
    io.to(id).emit('call-joined', call);
    delete calls[id];
    io.emit('call-filled', { id });
  });

  socket.on('begin-call', ({ id }) => {
    io.to(id).emit('call-began');
  });

  socket.on('send-candidate', ({ id, candidate }) => {
    socket.to(id).emit('candidate-sent', { candidate });
  });

  socket.on('create-offer', ({ id, offer }) => {
    socket.to(id).emit('offer-sent', { offer });
  });

  socket.on('create-answer', ({ id, answer }) => {
    socket.to(id).emit('answer-sent', { answer });
  });

  socket.on('end-call', ({ id }) => {
    io.to(id).emit('call-ended');
    io.socketsLeave(id);
  });
});
