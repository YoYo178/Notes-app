import { MongooseModel } from "@src/util/db.utils";
import { Schema, ObjectId } from "mongoose";

interface INote {
    user: ObjectId;
    title: string;
    description: string;
    images?: string[];
    audioKey?: string;
    isFavorite?: boolean;
    isText: boolean;
    duration: null | number;
}

const noteSchema: Schema = new Schema<INote>(
    {
        user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        title: { type: String, required: true },
        description: { type: String, required: true },
        isText: { type: Boolean, required: true, default: true },
        images: { type: [String], required: false },
        audioKey: { type: String, required: false },
        isFavorite: { type: Boolean, required: false, default: false },
        duration: { type: Schema.Types.Mixed, required: false, default: null }
    },
    {
        timestamps: true
    }
)

const Note = MongooseModel<INote>("notes", noteSchema);

export { INote, Note };