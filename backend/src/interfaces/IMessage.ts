import { IBase } from "@interfaces";

export default interface IMessage extends IBase {
  content: string;
  senderId: string;
  roomId: string;
}
