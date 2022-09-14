# WebRTC Video Chat

A video chat app made with WebRTC, Svelte, and Socket.io.

## Requirements

- Node 16
- Yarn
- Docker

## Setup

This project works with docker, but for consistency you might want to install the dependencies directly in your machine:

```bash
cd client
yarn install
cd ../server
yarn install
```

Now build the client and the server images:

```bash
docker compose build # docker-compose build
```

Finally, run your app:

```bash
docker compose up # docker-compose up
```

and visit http://localhost:3000/

## Some considerations

It might happen that the connection between the two devices won't stablish, so you might want to configure a [TURN server](https://webrtc.org/getting-started/turn-server).

## Documentation used for this project
- [Socket.io](https://socket.io/)
- [Svelte](https://svelte.dev/)
- [WebRTC](https://webrtc.org/)
