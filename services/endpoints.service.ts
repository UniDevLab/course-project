import { Endpoints } from "../models/endpoints.model";
import {
  UpdateEndpointsData,
  EndpointsCombinedModel,
  EndpointsData,
} from "../types/uri.types";

export class EndpointsService {
  private model: EndpointsCombinedModel;

  constructor() {
    this.model = Endpoints;
  }

  async create(user_id: string, data: EndpointsData) {
    const record = await this.getByUserId(user_id);

    if (record) return;

    const uri = { user_id, ...data };
    await this.model.create(uri);
  }

  async getByUserId(user_id: string) {
    const uri = await this.model.findByUserId(user_id);
    return uri;
  }

  async update(user_id: string, data: UpdateEndpointsData) {
    const updated = await this.model.update(user_id, data);
    return updated;
  }
}
