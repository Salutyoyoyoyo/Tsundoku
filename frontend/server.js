import {createServer} from "node:http";
import next from "next";
import {Server} from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({dev, hostname, port});
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer, {
        cors: {
            origin: "http://${hostname}:${port}",
            methods: ["GET", "POST"],
            allowedHeaders: ['my-custom-header'],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log(`Un utilisateur est connecté : ${socket.id}`);

        socket.on('ping', () => {
            socket.emit('pong', {message: 'Hello from server'});
        });

        socket.on("joinRoom", (roomId) => {
            socket.join(roomId);
        });

        socket.on('leaveRoom', (roomId) => {
            socket.leave(roomId);
        });

        socket.on("send_msg", (data) => {
            io.to(data.roomId).emit("receive_msg", data);
        });

        socket.on('markAsRead', ({conversationId, userId}) => {
            io.to(conversationId).emit('conversationRead', {conversationId, userId});
        });

        socket.on("typing", ({roomId, userId}) => {
            socket.to(roomId).emit("typing", {userId});
        });

        socket.on("stopTyping", ({roomId, userId}) => {
            socket.to(roomId).emit("stopTyping", {userId});
        });
        socket.on("disconnect", () => {
        });
    });

    httpServer.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Serveur prêt sur http://${hostname}:${port}`);
    });
});