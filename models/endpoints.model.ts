// @ts-nocheck
import mongoose, { Schema, SchemaTypes } from "mongoose";
import {
  UpdateEndpointsData,
  EndpointsCombinedDocument,
  EndpointsCombinedModel,
} from "../types/uri.types";

export class EndpointsLoadingMethods {
  static findByUserId(user_id: string) {
    const filter = { user_id };
    return this.findOne(filter);
  }

  static update(user_id: string, data: UpdateEndpointsData) {
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
  upload: { type: SchemaTypes.String, required: true, unique: true },
  update: { type: SchemaTypes.String, required: true, unique: true },
  delete: { type: SchemaTypes.String, required: true, unique: true },
  error: { type: SchemaTypes.String, required: true, unique: true },
  dataTypes: { type: SchemaTypes.Array, required: true },
});

schema.loadClass(EndpointsLoadingMethods);

export const Endpoints = mongoose.model<
  EndpointsCombinedDocument,
  EndpointsCombinedModel
>("Endpoints", schema);
