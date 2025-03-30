import { IBase } from "@interfaces";

interface IUser extends IBase {
    name: string;
    email: string;
    password: string;
}

export default IUser;