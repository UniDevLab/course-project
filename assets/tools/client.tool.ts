import * as Wix from "@wix/sdk";
import { items } from "@wix/data";
import { WixService } from "../../services/wix.service";

export class ClientTool {
  private tool = Wix;
  private modules = { items };
  private client: Wix.WixClient | null;
  private wixService: WixService;

  constructor() {
    this.client = null;
    this.wixService = new WixService();
  }

  private getModules() {
    return this.modules;
  }

  private async getAuth(user_id: string) {
    const { siteId, apiKey } = await this.wixService.getByUserId(user_id);
    return this.tool.ApiKeyStrategy({ siteId, apiKey });
  }

  private async getConfig(user_id: string) {
    const auth = await this.getAuth(user_id);
    const modules = this.getModules();
    return { auth, modules };
  }

  async getClient(user_id: string) {
    if (!this.client) {
      const config = await this.getConfig(user_id);
      this.client = this.tool.createClient(config);
    }
    return this.client;
  }
}
