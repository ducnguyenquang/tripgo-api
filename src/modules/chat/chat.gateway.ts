import type { Server } from "socket.io";

export function registerChatGateway(io: Server) {
  io.on("connection", (socket) => {
    socket.on("join-channel", (channelId: string) => {
      socket.join(`channel:${channelId}`);
    });

    socket.on("leave-channel", (channelId: string) => {
      socket.leave(`channel:${channelId}`);
    });

    socket.on("send-message", (payload: { channelId: string; content: string; imageUrl?: string }) => {
      io.to(`channel:${payload.channelId}`).emit("message-received", {
        ...payload,
        userId: socket.data.userId,
        socketId: socket.id,
      });
    });

    socket.on("typing", (payload: { channelId: string }) => {
      socket.to(`channel:${payload.channelId}`).emit("typing", {
        userId: socket.data.userId,
      });
    });
  });
}
