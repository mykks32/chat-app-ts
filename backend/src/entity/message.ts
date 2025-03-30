import {
    BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { IMessage } from "@interfaces";
import { User, Room } from "@entity";

@Entity("messages")
export default class Message extends BaseEntity implements IMessage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  content: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "senderId" })
  sender: User;

  @Column()
  senderId: string;

  @ManyToOne(() => Room, { onDelete: "CASCADE" })
  @JoinColumn({ name: "roomId" })
  room: Room;

  @Column()
  roomId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
