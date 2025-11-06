import mongoose from 'mongoose';

interface IVerificationCode {
  user: mongoose.Types.ObjectId;
  code: string;
  purpose: string;
  expiresAt: Date;
}

const codeSchema: mongoose.Schema = new mongoose.Schema<IVerificationCode>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    code: { type: String, required: true },
    purpose: { type: String, required: true, enum: ['user-verification', 'reset-password'] },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  {
    timestamps: true,
  },
);

const VerificationCode = mongoose.model<IVerificationCode>('codes', codeSchema);

export { IVerificationCode, VerificationCode };