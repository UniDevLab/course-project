import { CenshareService } from "./censhare.service";
import { Asset, FilterCondition, Notification } from "../types/censhare.types";

export class NotificationService extends CenshareService {
  constructor() {
    super();
  }

  private filterAndParse(assets: Asset[], condition: FilterCondition): Asset[] {
    return assets.filter(condition).map((asset) => this.parser.parse(asset));
  }

  private separate(assets: Asset[]) {
    const deleting = this.filterAndParse(assets, (asset) => asset.wixDeletion);
    const updating = this.filterAndParse(assets, (asset) => asset.toUpdate);
    return { deleting, updating };
  }

  private async getAssets(
    user_id: string,
    ids: number[],
    entity: string,
    dataTypes: string[]
  ) {
    const pending = ids.map((id) => this.downloadAsset(user_id, entity, id));
    const assets = await Promise.all(pending);
    const filtered = this.filterByDataTypes(dataTypes, assets);
    const separated = this.separate(filtered);
    return separated;
  }

  async process(
    user_id: string,
    dataTypes: string[],
    notification: Notification
  ) {
    const { ids, subscription } = notification;
    const { key } = subscription;
    const result = await this.getAssets(user_id, ids, key, dataTypes);
    return result;
  }
}
