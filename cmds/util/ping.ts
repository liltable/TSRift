import Command from "../../classes/Command.ts";
import Rift from "../../classes/Rift.ts";
import Category from "../../enum/Category.ts";
import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  Colors,
} from "npm:discord.js";

import ms from "npm:ms";

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
    const now = Date.now();

    interaction
      .reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Blue)
            .setDescription(`> Pinging...`),
        ],
      })
      .then(async () => {
        const latency = Date.now() - now;
        const { ping } = this.client.ws;
        const reply = await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Green)
              .setTitle(`${this.client.user?.username} | Latency`)
              .setDescription(
                `> :satellite: API Connection: \`${
                  ping > 0 ? `${ping}ms` : "Fetching..."
                }\`\n> :signal_strength: Response Time: \`${latency}ms\``
              ),
          ],
        });

        return setTimeout(async () => {
          if (reply.partial) await reply.fetch();
          if (reply.deletable) await reply.delete();
        }, ms("10s"));
      });
  }
}
