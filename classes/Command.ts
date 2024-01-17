import Category from "../enum/Category.ts";
import ICommand from "../interfaces/ICommand.ts";
import Rift from "./Rift.ts";
import ICommandOptions from "../interfaces/ICommandOptions.ts";
import {
  ChatInputCommandInteraction,
  AutocompleteInteraction,
} from "npm:discord.js";
import ICommandOptionOptions from "../interfaces/ICommandOptionOptions.ts";

export default class Command implements ICommand {
  client: Rift;
  name: string;
  description: string;
  options: ICommandOptionOptions[];
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

  execute(interaction: ChatInputCommandInteraction) {}
  autocomplete(interaction: AutocompleteInteraction) {}
}
