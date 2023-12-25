import { Censhare } from "../models/censhare.model";
import { FetchTool } from "../tools/fetch.tool";
import {
  EntityPage,
  UpdateCenshareData,
} from "../types/services/censhare.service.types";
import {
  CenshareData,
  CenshareCombinedModel,
} from "../types/models/censhare.model.types";

export class CenshareService extends FetchTool {
  private model: CenshareCombinedModel;

  constructor() {
    super(process.env.CENSHARE_API_URL);
    this.model = Censhare;
  }

  async create(user_id: string, data: CenshareData) {
    const record = await this.getByUserId(user_id);

    if (record) return;
    const credentials = { user_id, ...data };
    await this.model.create(credentials);
  }

  async getByUserId(user_id: string) {
    const record = await this.model.findByUserId(user_id);
    return record;
  }

  async update(user_id: string, data: UpdateCenshareData) {
    const record = await this.model.update(user_id, data);
    return record;
  }

  private async setAuthorization(user_id: string) {
    const { censhareUsername, censharePassword } =
      await this.getByUserId(user_id);
    return {
      username: censhareUsername,
      password: censharePassword,
    };
  }

  private setOffset(offset: number) {
    return { offset };
  }

  async getListOfEntities(user_id: string) {
    const route = this.formRoute("");
    const auth = await this.setAuthorization(user_id);
    const request = this.tool.get(route, { auth });
    const response = await this.handler<any, any>(request);
    return response;
  }

  filterByDataTypes(dataTypes: string[], assets: any[]) {
    return assets.filter((asset) => dataTypes.includes(asset.dateityp));
  }

  async downloadAsset(user_id: string, entity: string, assetId: number) {
    const route = this.formRoute(entity, assetId);
    console.log("Route", route);
    const auth = await this.setAuthorization(user_id);
    const request = this.tool.get(route, { auth });
    const response = await this.handler(request);
    return response;
  }

  async downloadEntities<T>(
    user_id: string,
    route: string,
    offset: number = 0
  ): Promise<T[]> {
    const limit = 100;
    const auth = await this.setAuthorization(user_id);
    const params = this.setOffset(offset);
    const request = this.tool.get(route, { auth, params });
    const response: EntityPage = await this.handler(request);
    const { count, result } = response;

    if (offset + count < response["total-count"]) {
      const nextOffset = offset + limit;
      const nextData = await this.downloadEntities(user_id, route, nextOffset);
      return [...result, ...nextData];
    }

    return result;
  }
}
