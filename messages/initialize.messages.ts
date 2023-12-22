import { ParserTool } from "../tools/parser.tool";
import { ListOfEntities } from "../types/services/censhare.service.types";
import { CenshareService } from "../services/censhare.service";

export class InitializeService extends CenshareService {
  private parser: ParserTool;
  constructor() {
    super();
    this.parser = new ParserTool();
  }

  private flatten<T>(arr: T[]) {
    const flat: any[] = [];

    for (const item of arr) {
      if (Array.isArray(item)) {
        flat.push(...this.flatten(item));
        continue;
      }

      flat.push(item);
    }

    return flat;
  }

  private filterEntities(list: ListOfEntities) {
    const keys = Object.keys(list);
    return keys.filter((key) => !key.includes("update"));
  }

  async getAllAssets(user_id: string, dataTypes: string[]) {
    const pending = [];
    const list = await this.getListOfEntities(user_id);
    const entities = this.filterEntities(list);

    for (const entity of entities) {
      const route = this.formRoute(entity);
      const collection = this.downloadEntities(user_id, route);
      pending.push(collection);
    }

    const assets = await Promise.all(pending).then(this.flatten.bind(this));
    const filtered = this.filterByDataTypes(dataTypes, assets);
    const translated = filtered.map(this.parser.parse.bind(this.parser));
    return translated;
  }
}
