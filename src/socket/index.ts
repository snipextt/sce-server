import { Server as ioServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { Server } from "http";
import { IUser, User } from "../models";
import { config } from "../_config";
import Classroom from "./Classroom";
import { v4 } from "uuid";

interface IToken {
  user: IUser;
  socket: Socket;
  classroomCode?: string;
}

interface IParsedTokens {
  [key: string]: IToken;
}

// TODO: shift this logic to a redis db
const parsedTokens: IParsedTokens = {};
const classroomLists: { [key: string]: Classroom } = {};

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
              return next(new Error("Authentication error"));
            }
            const user = await User.findById(decoded.user.id)
              .populate("section")
              .populate({
                path: "section",
                populate: {
                  path: "subjects",
                  model: "subject",
                },
              });
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
    socket.on("join", (classroomCode: string) => {
      const user: IUser = socket.handshake.auth.user;
      if (!user) {
        socket.emit("error", "Authentication error");
        return socket.disconnect();
      }
      if (!classroomLists[`${classroomCode}-${(user.section as any).code}`]) {
        if (user.type == "teacher") {
        } else {
          const match = ((user.section as any).subjects as Array<any>).find(
            (subject: any) => subject.code == classroomCode
          );
          if (!match) {
            socket.emit("error", "Authentication error");
            return socket.disconnect();
          }
          const classRoom = new Classroom(v4({}), classroomCode);
          parsedTokens[socket.handshake.auth.token].classroomCode =
            classroomCode;
          classRoom.addParticipant(socket);
          classroomLists[`${classroomCode}-${(user.section as any).code}`] =
            classRoom;
        }
      } else {
        classroomLists[
          `${classroomCode}-${(user.section as any).code}`
        ].addParticipant(socket);
      }
    });
    socket.on("disconnect", () => {
      const user: IUser = socket.handshake.auth.user;
      if (!user) {
        return;
      }
      const classroom =
        classroomLists[
          `${parsedTokens[socket.handshake.auth.token].classroomCode}-${
            (user.section as any).code
          }`
        ];
      if (classroom) {
        classroom.removeParticipant(socket);
      }
    });
  });
}
