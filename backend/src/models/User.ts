import { MongooseModel } from "@src/util/dbUtils";
import { Schema } from "mongoose";

interface IUser {
    displayName: string;
    username: string;
    password: string;
}

const userSchema: Schema = new Schema<IUser>({
    displayName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
})

const User = MongooseModel<IUser>("users", userSchema);

export { IUser, User }