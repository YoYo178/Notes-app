import { MongooseModel } from "@src/util/db.utils";
import { Schema } from "mongoose";

interface IUserRecoveryState {
    isRecovering: boolean;
    hasVerifiedMail: boolean;
    hasSetPassword: boolean;
};

interface IUser {
    displayName: string;
    username: string;
    password: string;
    email: string;
    isVerified: boolean;
    recoveryState: IUserRecoveryState;
}

const userSchema: Schema = new Schema<IUser>({
    displayName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    isVerified: { type: Boolean, required: false, default: false },
    recoveryState: new Schema<IUserRecoveryState>({
        isRecovering: { type: Boolean, required: false, default: false },
        hasVerifiedMail: { type: Boolean, required: false, default: false },
        hasSetPassword: { type: Boolean, required: false, default: false }
    })
})

const User = MongooseModel<IUser>("users", userSchema);

export { IUser, User }