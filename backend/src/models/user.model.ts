import mongoose from 'mongoose';

interface IUserRecoveryState {
  isRecovering: boolean;
  hasVerifiedMail: boolean;
  hasSetPassword: boolean;
}

const userRecoveryStateSchema = new mongoose.Schema<IUserRecoveryState>({
  isRecovering: { type: Boolean, required: false, default: false },
  hasVerifiedMail: { type: Boolean, required: false, default: false },
  hasSetPassword: { type: Boolean, required: false, default: false },
});

interface IUser {
  _id: mongoose.Types.ObjectId;

  displayName: string;
  username: string;
  password: string;
  hasLegacyHashing: boolean;
  email: string;
  isVerified: boolean;
  recoveryState: IUserRecoveryState;
}

const userSchema: mongoose.Schema = new mongoose.Schema<IUser>({
  displayName: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  hasLegacyHashing: { type: Boolean, default: false },
  email: { type: String, required: true },
  isVerified: { type: Boolean, required: false, default: false },
  recoveryState: { type: userRecoveryStateSchema, required: false, default: () => ({}) },
});

const User = mongoose.model<IUser>('users', userSchema);

export { type IUser, User };
