import { Asset } from "../../types/external/assets/assets.types";
import { Failure } from "../../types/external/assets/collection.assets.types";
import { CollectionTool } from "../tools/collection.tool";

export class AssetService {
  private tool: CollectionTool;

  constructor() {
    this.tool = new CollectionTool();
  }

  async upload(user_id: string, assets: Asset[]) {
    const { nonExsiting } = await this.tool.checkExistance(user_id, assets);

    if (!nonExsiting.length) return [];

    const result = await this.tool.upload(user_id, nonExsiting);
    return result;
  }

  async update(user_id: string, assets: Asset[]) {
    const { existing, nonExsiting } = await this.tool.checkExistance(
      user_id,
      assets
    );

    if (nonExsiting.length) await this.upload(user_id, nonExsiting);

    if (!existing.length) return [];

    const result = await this.tool.update(user_id, existing);
    return result;
  }

  async delete(user_id: string, assets: Asset[]) {
    const { existing } = await this.tool.checkExistance(user_id, assets);

    if (!existing.length) return [];

    const result = await this.tool.delete(user_id, existing);
    return result;
  }

  async error(
    user_id: string,
    failures: Array<Failure | Error>
  ): Promise<Failure[]> {
    await this.tool.error(user_id, failures);
    return [];
  }
}
