import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { IMessage, IUser } from "@interfaces";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Message from "./message";

@Entity("users")
export default class User extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false, unique: true })
  email!: string;

  @Column({ nullable: false })
  password!: string;

  @OneToMany(() => Message, (message) => message.sender)
  messages: IMessage[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Encrypt password before saving
  @BeforeInsert()
  async hashPassword() {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      throw new Error("Error hashing password: " + error.message);
    }
  }

  // Compare password
  async comparePassword(password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      throw new Error("Error comparing passwords: " + error.message);
    }
  }

  // Generate JWT Token
  generateToken() {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT Secret is not defined");
    }

    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  }
}
