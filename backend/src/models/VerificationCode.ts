import { MongooseModel } from '@src/util/db.utils';
import { ObjectId, Schema } from 'mongoose';

interface IVerificationCode {
    user: ObjectId;
    code: string;
    purpose: string;
    expiresAt: Date;
}

const codeSchema: Schema = new Schema<IVerificationCode>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    code: { type: String, required: true },
    purpose: { type: String, required: true, enum: ['user-verification', 'reset-password'] },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  {
    timestamps: true,
  },
);

const VerificationCode = MongooseModel<IVerificationCode>('codes', codeSchema);

export { IVerificationCode, VerificationCode };