import CRUDManager from "../CRUDManager.mjs";
import Owner from "./Owner.mjs";

class OwnersDBService extends CRUDManager {}
export default new OwnersDBService(Owner);
