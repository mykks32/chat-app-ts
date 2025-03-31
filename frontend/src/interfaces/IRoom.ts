import { IBase, IMessage } from "@/interfaces";

export default interface IRoom extends IBase {
  name: string;
  messages: IMessage[];
}