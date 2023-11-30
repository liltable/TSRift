import ItemType from "../enum/ItemType.ts";
import IItemTier from "../enum/ItemTier.ts";

export default interface IInventoryItem {
  name: string;
  description?: string;
  amount: number | 1;
  type: ItemType;
  class: IItemTier | IItemTier.Basic;
  equipped: boolean | false;
}
