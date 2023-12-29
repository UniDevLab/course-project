import { StorageTool } from '../../src/broker/tools/storage.tool';
import { describe, expect, beforeEach, it } from "@jest/globals";

describe('StorageTool', () => {
    let storageTool: StorageTool<any>;
  
    beforeEach(() => {
      storageTool = new StorageTool();
    });
    it('createCollectionKey should generate a valid collection key', () => {
      const userId = 'itUser';
      const name = 'itCollection';
      const key = storageTool.createCollectionKey(userId, name);
  
      expect(key).toBe(`${userId}_${name}`);
    });
  });