import Command from "../../classes/Command.ts";
import Rift from "../../classes/Rift.ts";
import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "npm:discord.js";
import Category from "../../enum/Category.ts";

export default class Emit extends Command {
  constructor(client: Rift) {
    super(client, {
      name: "emit",
      description: "Emits a client event for testing purposes.",
      options: [],
      isDevCommand: true,
      default_member_permissions: PermissionFlagsBits.Administrator,
      category: Category.Dev,
      cooldown: 10,
      dm_permission: false,
    });
  }

  execute(interaction: ChatInputCommandInteraction) {
    return interaction.reply("nuh uh!");
  }
}
