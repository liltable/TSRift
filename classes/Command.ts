import Category from "../enum/Category.ts";
import ICommand from "../interfaces/ICommand.ts";
import Rift from "./Rift.ts";
import ICommandOptions from "../interfaces/ICommandOptions.ts";
import { ChatInputCommandInteraction } from "npm:discord.js";

export default class Command implements ICommand {
  client: Rift;
  name: string;
  description: string;
  options: object;
  category: Category;
  default_member_permissions: bigint;
  dm_permission: boolean;
  cooldown: number;
  isDevCommand: boolean;

  constructor(client: Rift, options: ICommandOptions) {
    this.client = client;
    this.name = options.name;
    this.description = options.description;
    this.options = options.options;
    this.category = options.category;
    this.default_member_permissions = options.default_member_permissions;
    this.dm_permission = options.dm_permission;
    this.cooldown = options.cooldown;
    this.isDevCommand = options.isDevCommand;
  }

  execute(interaction: ChatInputCommandInteraction): void {}
  autocomplete(interaction: ChatInputCommandInteraction): void {}
}
