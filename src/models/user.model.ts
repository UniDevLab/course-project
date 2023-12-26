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

  static delete(_id: string) {
    const conditions = { _id };
    return this.findOneAndDelete(conditions);
  }
}

const schema = new Schema({
  email: { type: SchemaTypes.String, required: true, unique: true },
  password: { type: SchemaTypes.String, required: true },
});

schema.loadClass(UserLoadingMethods);

schema.pre("findOneAndDelete", function (next) {
  const models = [Token, Checkpoint, Wix, Censhare];
  models.forEach((model) => model.deleteOne({ user_id: this._id }).exec());
  next();
});

export const User = mongoose.model<UserCombinedDocument, UserCombinedModel>(
  "User",
  schema
);
