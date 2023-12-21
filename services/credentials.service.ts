import { Credentials } from "../models/credentials.model";
import {
  CredentialsData,
  CredentialsCombinedModel,
  UpdateCredentialsData,
} from "../types/credential.types";

export class CredentialsService {
  private model: CredentialsCombinedModel;

  constructor() {
    this.model = Credentials;
  }

  async create(user_id: string, data: CredentialsData) {
    const record = await this.getByUserId(user_id);

    if (record) return;
    const credentials = { user_id, ...data };
    await this.model.create(credentials);
  }

  async getByUserId(user_id: string) {
    const record = await this.model.findByUserId(user_id);
    return record;
  }

  async update(user_id: string, data: UpdateCredentialsData) {
    const record = await this.model.update(user_id, data);
    return record;
  }
}
