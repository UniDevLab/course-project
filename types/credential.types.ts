import { Model } from "mongoose";
import { CredentialsLoadingMethods } from "../models/credentials.model";

export type CredentialsData = {
  secret: string;
  censhareUsername: string;
  censharePassword: string;
};

export type UpdateCredentialsData = {
  [key: string]: string;
};

export type CredentialsSchema = CredentialsData & {
  user_id: string;
};

export type CredentialsCombinedSchema = CredentialsSchema &
  CredentialsLoadingMethods;

export type CredentialsCombinedModel = Model<CredentialsCombinedSchema> &
  typeof CredentialsLoadingMethods;

export type CredentialsCombinedDocument = Document & CredentialsCombinedSchema;
