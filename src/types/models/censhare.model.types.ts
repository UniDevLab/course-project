import { Model } from "mongoose";
import { CenshareLoadingMethods } from "../../models/censhare.model";

export type CenshareData = {
  censhareUsername: string;
  censharePassword: string;
};

export type CenshareSchema = CenshareData & {
  user_id: string;
};

export type CenshareCombinedSchema = CenshareSchema & CenshareLoadingMethods;

export type CenshareCombinedModel = Model<CenshareCombinedSchema> &
  typeof CenshareLoadingMethods;

export type CenshareCombinedDocument = Document & CenshareCombinedSchema;
