import { FetchTool } from "../tools/fetch.tool";
import { ParserTool } from "../tools/parser.tool";
import { Asset, EntityPage } from "../types/censhare.types";
import { CredentialsService } from "./credentials.service";

export class CenshareService extends FetchTool {
  public parser: ParserTool;
  private credentials: CredentialsService;

  constructor() {
    super(process.env.CENSHARE_API_URL);
    this.credentials = new CredentialsService();
    this.parser = new ParserTool();
  }

  private async setAuthorization(user_id: string) {
    const { censhareUsername, censharePassword } =
      await this.credentials.getByUserId(user_id);
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

  filterByDataTypes(dataTypes: string[], assets: Asset[]) {
    return assets.filter((asset) => dataTypes.includes(asset.dateityp));
  }

  async downloadAsset(user_id: string, entity: string, assetId: number) {
    const route = this.formRoute(entity, assetId);
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
