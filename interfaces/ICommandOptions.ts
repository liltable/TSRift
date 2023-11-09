import Category from "../enum/Category.ts";

export default interface ICommandOptions {
  name: string;
  description: string;
  options: object;
  category: Category;
  default_member_permissions: bigint;
  dm_permission: boolean;
  cooldown: number;
  isDevCommand: boolean;
}
