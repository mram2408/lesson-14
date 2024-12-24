import Type from "./Type.mjs";
import CRUDManager from "../CRUDManager.mjs";

class TypesDBService extends CRUDManager {
  static async getList({ filters }) {
    try {
      const res = await Type.find(filters, { title: 1 });
      return res;
    } catch (error) {
      return [];
    }
  }
}

export default new TypesDBService(Type);
