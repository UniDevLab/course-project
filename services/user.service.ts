import { PasswordTool } from "../tools/password.tool";
import { CustomError } from "../constructors/error.constructor";
import { User } from "../models/user.model";
import {
  ChangePassword,
  ResetPassword,
  UserCombinedModel,
} from "../types/user.types";
import {
  AuthRedirect,
  AuthTokens,
  FinalStep,
  InitialStep,
  Login,
  Refresh,
} from "../types/auth.types";
import { TokenService } from "./token.service";
import { CheckpointService } from "./checkpoint.service";
import { EndpointsService } from "./endpoints.service";
import { CredentialsService } from "./credentials.service";

export class UserService {
  private token: TokenService;
  private password: PasswordTool;
  private model: UserCombinedModel;
  private endpoints: EndpointsService;
  private checkpoint: CheckpointService;
  private credentials: CredentialsService;

  constructor() {
    this.model = User;
    this.token = new TokenService();
    this.password = new PasswordTool();
    this.endpoints = new EndpointsService();
    this.checkpoint = new CheckpointService();
    this.credentials = new CredentialsService();
  }

  async getById(id: string) {
    const account = await this.model.findById(id);
    return account;
  }

  async getByEmail(email: string) {
    const account = await this.model.findByEmail(email);
    return account;
  }

  async createAccount(input: InitialStep): Promise<AuthRedirect> {
    const { email, password } = input;
    const hashedPassword = this.password.hash(password);
    const data = { email, password: hashedPassword };
    const account = await this.model.create(data);
    const _id = account._id.toString();
    await this.checkpoint.setState(_id);
    const encodedData = { _id, email };
    const accessToken = this.token.getAccessToken(encodedData);
    return { accessToken, url: "/registration/step-two" };
  }

  async fillInAccount(input: FinalStep): Promise<AuthTokens> {
    const { _id, email, credentials, endpoints } = input;
    console.log("credentials", credentials);
    await this.credentials.create(_id, credentials);
    await this.endpoints.create(_id, endpoints);
    await this.checkpoint.setState(_id);
    const tokens = await this.token.getTokens({ _id, email });
    return tokens;
  }

  async login(input: Login): Promise<AuthRedirect | AuthTokens> {
    const account = await this.getByEmail(input.email);
    const encoded = { _id: account._id.toString(), email: account.email };
    const similar = this.password.compare(input.password, account.password);
    const state = await this.checkpoint.getState(encoded._id);

    if (!similar) {
      throw new CustomError("Auth Error", "Invalid input!", 401);
    }

    if (similar && state) {
      const tokens = this.token.updateTokens(encoded);
      return tokens;
    }

    const accessToken = this.token.getAccessToken(encoded);
    return { accessToken, url: "/registration/step-two" };
  }

  async refresh(input: Refresh) {
    const { refreshToken } = input;
    const decoded = this.token.decodeToken(refreshToken);

    if (typeof decoded === "string") {
      throw new CustomError("Token Error", "Expired refresh token", 401);
    }

    const encoded = { _id: decoded._id, email: decoded.email };
    const accessToken = this.token.getAccessToken(encoded);
    return { accessToken, refreshToken };
  }

  async changePassword(id: string, input: ChangePassword) {
    const user = await this.model.findById(id);
    const similar = this.password.compare(input.oldPassword, user.password);

    if (!similar) {
      throw new CustomError("User Error", "Invalid old password", 401);
    }

    const password = this.password.hash(input.newPassword);
    await this.model.changePassword(id, password);
  }

  async resetPassword(input: ResetPassword) {
    const user = await this.model.findByEmail(input.email);
    const id = user._id.toString();
    const credentials = await this.credentials.getByUserId(id);

    if (credentials.secret !== input.secret) {
      throw new CustomError("User Error", "Invalid secret word", 401);
    }

    const password = this.password.hash(input.newPassword);
    await this.model.changePassword(id, password);
  }

  async delete(id: string) {
    await this.model.findByIdAndRemove(id);
  }
}
