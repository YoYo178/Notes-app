import { MongooseModel } from "@src/util/dbUtils";
import { Schema } from "mongoose";

const { Types: { ObjectId } } = Schema;

interface INote {
    user: typeof ObjectId;
    title: string;
    description: string;
    password: string;
    images: string[];
}

const noteSchema: Schema = new Schema<INote>(
    {
        user: { type: ObjectId, required: true, ref: 'User' },
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