import mongoose from 'mongoose';

interface INote {
    user: mongoose.Types.ObjectId;
    title: string;
    description: string;
    images?: string[];
    audio?: string;
    isFavorite: boolean;
    isText: boolean;
    duration: null | number;
}

const noteSchema: mongoose.Schema = new mongoose.Schema<INote>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    isText: { type: Boolean, required: true, default: true },
    images: { type: [String], required: false },
    audio: { type: String, required: false },
    isFavorite: { type: Boolean, required: false, default: false },
    duration: { type: mongoose.Schema.Types.Mixed, required: false, default: null },
  },
  {
    timestamps: true,
  },
);

const Note = mongoose.model<INote>('notes', noteSchema);

export { INote, Note };