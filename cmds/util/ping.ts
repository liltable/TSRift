import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  Colors,
} from "npm:discord.js";
import Command from "../../classes/Command.ts";
import Rift from "../../classes/Rift.ts";
import Category from "../../enum/Category.ts";

export default class Ping extends Command {
  constructor(client: Rift) {
    super(client, {
      name: "ping",
      description:
        "Returns info about the client's connection to the Discord API.",
      options: [],
      cooldown: 3,
      category: Category.Util,
      dm_permission: false,
      isDevCommand: false,
      default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
    });
  }

  execute(interaction: ChatInputCommandInteraction) {
    const ping =
      this.client.ws.ping > 1 ? "`Unavailable...`" : this.client.ws.ping;

    return interaction.reply({
      embeds: [
        new EmbedBuilder({
          title: `${this.client.user!.username} | Latency`,
          description: `> :satellite: API Latency: ${ping}`,
          color: Colors.Blue,
        }),
      ],
      ephemeral: true,
    });
  }
}
