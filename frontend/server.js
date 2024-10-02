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
            socket.emit('pong', { message: 'Hello from server' });
        });

        socket.on("joinRoom", (roomId) => {
            socket.join(roomId);
            console.log(`Utilisateur ${socket.id} a rejoint la room ${roomId}`);
        });

        socket.on('leaveRoom', (roomId) => {
            socket.leave(roomId);
            console.log(`Client ${socket.id} a quitté la room ${roomId}`);
        });

        socket.on("send_msg", (data) => {
            console.log(`Message reçu de ${data.userEmail} dans la room ${data.roomId}: ${data.content}`);
            console.log('data.roomId :', data.roomId);

            io.to(data.roomId).emit("receive_msg", data);
            console.log(`Événement "receive_msg" émis dans la room ${data.roomId} avec le message: ${data.content}`);

        });

        socket.on('markAsRead', ({ conversationId, userId }) => {
            console.log(`Marquer la conversation ${conversationId} comme lue pour l'utilisateur ${userId}`);

            io.to(conversationId).emit('conversationRead', { conversationId, userId });
        });

        socket.on("disconnect", () => {
            console.log(`Utilisateur déconnecté : ${socket.id}`);
        });
    });

    httpServer.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Serveur prêt sur http://${hostname}:${port}`);
    });
});