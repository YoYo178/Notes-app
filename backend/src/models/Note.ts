import { MongooseModel } from "@src/util/dbUtils";
import { Schema, ObjectId } from "mongoose";

interface INote {
    user: ObjectId;
    title: string;
    description: string;
    password: string;
    images: string[];
}

const noteSchema: Schema = new Schema<INote>(
    {
        user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        title: { type: String, required: true },
        description: { type: String, required: true },
        images: [{ type: String, required: false }],
    },
    {
        timestamps: true
    }
)

const Note = MongooseModel<INote>("notes", noteSchema);

export { INote, Note };