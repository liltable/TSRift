import {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} from "npm:discord.js";
import Command from "../../classes/Command.ts";
import Rift from "../../classes/Rift.ts";
import Category from "../../enum/Category.ts";

export default class ItemInfo extends Command {
  constructor(client: Rift) {
    super(client, {
      name: "item-info",
      description: "Returns important information about an item.",
      options: [
        {
          name: "keyword",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
      dm_permission: false,
      default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
      category: Category.Game,
      isDevCommand: false,
      cooldown: 5,
    });
  }
}
