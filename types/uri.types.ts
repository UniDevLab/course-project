import { Model } from "mongoose";
import { EndpointsLoadingMethods } from "../models/endpoints.model";

export type EndpointsData = {
  upload: string;
  update: string;
  delete: string;
  error: string;
  dataType: string[];
};

export type UpdateEndpointsData = {
  [key: string]: string;
};

export type EndpointsSchema = EndpointsData & {
  user_id: string;
};

export type EndpointsCombinedSchema = EndpointsSchema & EndpointsLoadingMethods;

export type EndpointsCombinedModel = Model<EndpointsCombinedSchema> &
  typeof EndpointsLoadingMethods;

export type EndpointsCombinedDocument = Document & EndpointsCombinedSchema;
