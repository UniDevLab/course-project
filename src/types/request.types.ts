import { Request } from "express";
import { Identification } from "./services/user.service.types";

export type AuthedRequest = Request & {
  identification: Identification;
};

export type ExtendedRequest<T> = Request & {
  body: T;
};

export type AuthedExtendedRequest<T> = ExtendedRequest<T> & AuthedRequest;
