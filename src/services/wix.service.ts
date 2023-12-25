import { Wix } from "../models/wix.model";
import { UpdateWixData } from "../types/services/wix.service.types";
import { WixCombinedModel, WixData } from "../types/models/wix.model.types";

export class WixService {
  private model: WixCombinedModel;

  constructor() {
    this.model = Wix;
  }

  async create(user_id: string, data: WixData) {
    const record = await this.getByUserId(user_id);

    if (record) return;

    const uri = { user_id, ...data };
    await this.model.create(uri);
  }

  async getByUserId(user_id: string) {
    const record = await this.model.findByUserId(user_id);
    return record;
  }

  async update(user_id: string, data: UpdateWixData) {
    const updated = await this.model.update(user_id, data);
    return updated;
  }
}
