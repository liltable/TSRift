import Command from "../../classes/Command.ts";
import Rift from "../../classes/Rift.ts";
import Default from "../../enum/Default.ts";
import {
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  GuildTextBasedChannel,
} from "npm:discord.js";
import Category from "../../enum/Category.ts";
import Storage from "../../schemas/guild.ts";

export default class SetupCommand extends Command {
  constructor(client: Rift) {
    super(client, {
      name: "config",
      description: "Open the Rift configuration menu.",
      options: [],
      dm_permission: false,
      default_member_permissions: PermissionFlagsBits.ManageGuild,
      cooldown: 10,
      isDevCommand: false,
      category: Category.Mod,
    });
  }

  async execute(interaction: ChatInputCommandInteraction) {
    const Config = await Storage.findOne({ guildID: interaction.guild!.id });

    if (!Config) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setTitle(`${this.client.user!.username} | Config`)
            .setDescription(
              `> The server configuration has not been setup yet.`
            ),
        ],
        components: [
          //@ts-ignore deez
          new ActionRowBuilder().setComponents(
            new ButtonBuilder()
              .setLabel("Setup")
              .setStyle(ButtonStyle.Success)
              .setCustomId("configSetup"),
            Default.ExitButton
          ),
        ],
      });
    } else {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Config.logs!.enabled ? Colors.Green : Colors.Red)
            .setTitle(`${this.client.user!.username} | Config`)
            .setDescription(
              `> Logging: ${
                Config.logs!.enabled ? ":white_check_mark:" : ":no_entry_sign:"
              }\n> Channel: ${
                ((await this.client.channels.fetch(
                  Config.logs!.channelID
                )) as GuildTextBasedChannel) || `\`None set.\``
              }`
            ),
        ],

        components: [
          //@ts-ignore hi there
          new ActionRowBuilder().setComponents(
            new ButtonBuilder()
              .setCustomId("configReset")
              .setLabel("Reset")
              .setStyle(ButtonStyle.Danger),
            Default.ExitButton
          ),
        ],
      });
    }
  }
}
