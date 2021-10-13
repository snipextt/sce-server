import { Server as ioServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { Server } from "http";
import { IUser, User } from "../models";
import { config } from "../_config";

interface IToken {
  user: IUser;
  socket: Socket;
}

interface IParsedTokens {
  [key: string]: IToken;
}

// TODO: shift this logic to a redis db
const parsedTokens: IParsedTokens = {};

export function inject(httpServer: Server) {
  const io = new ioServer(httpServer, {
    cors: {
      origin: "*",
    },
  });
  io.of("/classroom").use(function (socket, next) {
    const token = socket.handshake.auth.token;
    if (token) {
      if (parsedTokens[token]) {
        socket.handshake.auth.user = parsedTokens[token].user;
        next();
      } else {
        jwt.verify(
          token,
          config.get("jwtSecret")!,
          async (err: any, decoded: any) => {
            if (err) {
              console.log("here");
              return next(new Error("Authentication error"));
            }
            const user = await User.findById(decoded.user.id).select(
              "-password"
            );
            if (!user) {
              return next(new Error("Authentication error"));
            }
            parsedTokens[token] = {
              socket,
              user: user as IUser,
            };
            socket.handshake.auth.user = parsedTokens[token].user;
            next();
          }
        );
      }
    } else {
      next(new Error("authentication error"));
    }
  });
  io.of("/classroom").on("connection", (socket) => {
    socket.on("disconnect", () => {
      console.log("disconnected");
    });
  });
}
