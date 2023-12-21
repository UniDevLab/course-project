import { EndpointsData } from "./uri.types";
import { CredentialsData } from "./credential.types";

export type Login = {
  email: string;
  password: string;
};

export type Registration = {
  email: string;
  password: string;
};

export type Identification = {
  _id: string;
  email: string;
};

export type InitialStep = {
  email: string;
  password: string;
};

export type FinalStep = Identification & {
  credentials: CredentialsData;
  endpoints: EndpointsData;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthRedirect = {
  redirect?: boolean;
  url?: string;
  accessToken: string;
};

export type Refresh = {
  refreshToken: string;
};
