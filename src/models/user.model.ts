// @ts-nocheck
import { Wix } from "./wix.model";
import { Token } from "./token.model";
import { Censhare } from "./censhare.model";
import { Checkpoint } from "./checkpoint.model";
import mongoose, { Schema, SchemaTypes } from "mongoose";
import {
  UserCombinedDocument,
  UserCombinedModel,
} from "../types/models/user.model.types";

export class UserLoadingMethods {
  static changePassword(_id: string, password: string) {
    const conditions = { _id };
    const update = { password };
    return this.findOneAndUpdate(conditions, update);
  }

  static findByEmail(email: string) {
    const filter = { email };
    return this.findOne(filter);
  }
}

const schema = new Schema({
  email: { type: SchemaTypes.String, required: true, unique: true },
  password: { type: SchemaTypes.String, required: true },
});

schema.loadClass(UserLoadingMethods);

export const User = mongoose.model<UserCombinedDocument, UserCombinedModel>(
  "User",
  schema
);
