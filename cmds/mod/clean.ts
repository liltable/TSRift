import Command from "../../classes/Command.ts";
import Rift from "../../classes/Rift.ts";
import Category from "../../enum/Category.ts";
import IClean from "../../interfaces/IClean.ts";
import Default from "../../enum/Default.ts";
import {
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  GuildMember,
  EmbedBuilder,
  Colors,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "npm:discord.js";

export default class Clean extends Command {
  constructor(client: Rift) {
    super(client, {
      name: "clean",
      description: "Bulk-delete's messages from this channel.",
      options: [
        {
          name: "amount",
          description: "Input the amount of messages to delete.",
          type: ApplicationCommandOptionType.Number,
          required: true,
        },
        {
          name: "target",
          description: "Target messages from a specific guild member.",
          type: ApplicationCommandOptionType.Mentionable,
          required: false,
        },
        {
          name: "filter",
          description: "Target messages with a specific word/phrase.",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
        {
          name: "reason",
          description: "Input a reason,",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
      ],
      category: Category.Mod,
      default_member_permissions: PermissionFlagsBits.ManageMessages,
      cooldown: 10,
      dm_permission: false,
      isDevCommand: true,
    });
  }

  async execute(interaction: ChatInputCommandInteraction) {
    const amount = interaction.options.getNumber("amount", true);
    const target = interaction.options.getMentionable(
      "target",
      false
    ) as GuildMember;
    const filter = interaction.options.getString("filter", false)!;
    const reason = interaction.options.getString("reason", false)!;
    const Clean: IClean = {
      amount: amount,
      target: target,
      filter: filter,
      reason: reason,
    };

    if (amount > 100) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(`> Message amount cannot exceed 100 messages!`),
        ],
        ephemeral: true,
      });
    }
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.Orange)
          .setTitle(`${this.client.user!.username} | Clean`)
          .setDescription(`> Clean ${amount} messages from this channel?`),
      ],
      components: [
        //@ts-ignore deez nuts
        new ActionRowBuilder().setComponents(
          new ButtonBuilder()
            .setCustomId("clean")
            .setLabel("Confirm")
            .setStyle(ButtonStyle.Success),
          Default.ExitButton as ButtonBuilder
        ),
      ],
    });

    return this.client.cache.set(
      ((await interaction.fetchReply()).id += `:clean`),
      Clean
    );
  }
}
