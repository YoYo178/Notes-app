import { DefaultSchemaOptions, Document, model, Model, ObtainDocumentType, Schema } from "mongoose";

export function MongooseModel<T>(docName: string, docSchema: Schema): Model<T & Document> {
    return model<T & Document>(docName, docSchema);
}