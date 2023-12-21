// @ts-nocheck

import mongoose, { Schema, SchemaTypes } from "mongoose";
import { UserCombinedDocument, UserCombinedModel } from "../types/user.types";
import { Token } from "./token.model";
import { Checkpoint } from "./checkpoint.model";
import { Uri } from "./endpoints.model";

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

schema.pre("remove", function (next) {
  const models = [Token, Checkpoint, Uri];
  models.forEach((model) => model.remove({ user_id: this._id }).exec());
  next();
});

export const User = mongoose.model<UserCombinedDocument, UserCombinedModel>(
  "User",
  schema
);
