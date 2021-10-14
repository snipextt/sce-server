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
    console.log("Creating new classroom");
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
    if (this.participantsList[participant.handshake.auth.user._id]) {
      participant.emit("error", "You are already in this classroom");
      return participant.disconnect();
    }
    participant.on("message", (message: string) => {
      this.brodcastMessage(message, participant);
    });

    this.participantsList[participant.handshake.auth.user._id] =
      participant.handshake.auth.user;
    participant.join(this.id);
  }
  removeParticipant(participant: Socket) {
    console.log("Removing participant");
    delete this.participantsList[participant.handshake.auth.user._id];
    try {
      participant.leave(this.id);
      participant.disconnect();
    } catch (err) {
      console.error(err);
    }
  }
  getParticipants() {
    return this.participantsList;
  }
}

export default Classroom;
