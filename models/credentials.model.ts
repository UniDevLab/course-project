// @ts-nocheck
import mongoose, { Schema, SchemaTypes } from "mongoose";
import {
  CredentialsCombinedDocument,
  CredentialsCombinedModel,
  UpdateCredentials,
} from "../types/credential.types";

export class CredentialsLoadingMethods {
  static findByUserId(user_id: string) {
    const filter = { user_id };
    return this.findOne(filter);
  }

  static update(user_id: string, data: UpdateCredentials) {
    const filter = { user_id };
    const projection = {};

    for (const field in data) {
      projection[field] = 1;
    }

    const options = { new: true, projection };
    return this.findOneAndUpdate(filter, data, options);
  }
}

const schema = new Schema({
  user_id: {
    type: SchemaTypes.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  secret: { type: SchemaTypes.String, required: true },
  censhareUsername: { type: SchemaTypes.String, required: true },
  censharePassword: { type: SchemaTypes.String, required: true },
});

schema.loadClass(CredentialsLoadingMethods);

export const Credentials = mongoose.model<
  CredentialsCombinedDocument,
  CredentialsCombinedModel
>("Credentials", schema);
