import Command from "../../classes/Command.ts";
import Rift from "../../classes/Rift.ts";
import Category from "../../enum/Category.ts";
import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  Colors,
} from "npm:discord.js";

export default class Ping extends Command {
  constructor(client: Rift) {
    super(client, {
      name: "ping",
      description: "Returns the websocket information of the client.",
      default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
      category: Category.Dev,
      cooldown: 3,
      options: [],
      dm_permission: false,
      isDevCommand: true,
    });
  }

  execute(interaction: ChatInputCommandInteraction) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.Red)
          .setTitle(`${this.client.user!.username} | Latency`)
          .setDescription(
            `:satellite: API Latency: \`${
              this.client.ws.ping > 1 ? `Unavailable...` : this.client.ws.ping
            }\``
          ),
      ],
    });
  }
}
