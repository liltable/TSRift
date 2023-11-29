import IInventoryItem from "./IInventoryItem.ts";

export default interface IPlayer {
  id: string;
  xp: number | 0;
  level: number | 1;
  skillPoints: number | 0;
  inventory: IInventoryItem[];
}
