import Category from "../enum/Category.ts";
import ICommandOptionOptions from "./ICommandOptionOptions.ts";

export default interface ICommandOptions {
  name: string;
  description: string;
  options: ICommandOptionOptions[];
  category: Category;
  default_member_permissions: bigint;
  dm_permission: boolean;
  cooldown: number;
  isDevCommand: boolean;
}
