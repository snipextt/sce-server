import { Socket } from "socket.io";
import { IUser } from "../models";

interface IParticipantsList {
  [key: string]: IUser;
}

class Classroom {
  name: string;
  id: string;
  moderator?: Socket;
  allowNonModeratorMedia: boolean;
  participantsList: IParticipantsList = {};
  constructor(id: string, name: string, moderator?: Socket) {
    this.id = id;
    this.name = name;
    this.moderator = moderator;
    this.allowNonModeratorMedia = false;
  }
  addModerator(moderator: Socket) {
    this.moderator = moderator;
    this.addParticipant(moderator);
  }
  brodcastMessage(message: string, socket: Socket) {
    socket.to(this.id).emit("message", message);
  }
  setAllowNonModeratorMedia(allow: boolean) {
    this.allowNonModeratorMedia = allow;
  }
  addParticipant(participant: Socket) {
    this.participantsList[participant.id] = participant.handshake.auth.user;
    participant.join(this.id);
  }
  removeParticipant(participant: Socket) {
    delete this.participantsList[participant.id];
    participant.leave(this.id);
    participant.disconnect();
  }
  getParticipants() {
    return this.participantsList;
  }
}

export default Classroom;
