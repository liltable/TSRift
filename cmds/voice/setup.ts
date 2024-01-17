import {
  ApplicationCommandOptionType,
  AutocompleteInteraction,
  ChannelType,
  ChatInputCommandInteraction,
  Guild,
  PermissionFlagsBits,
  CategoryChannel,
  EmbedBuilder,
  Colors,
} from "npm:discord.js";
import Command from "../../classes/Command.ts";
import Rift from "../../classes/Rift.ts";
import Category from "../../enum/Category.ts";
import { TempVCConfig } from "../../schemas/activity.ts";

export default class SetupTempVCs extends Command {
  constructor(client: Rift) {
    super(client, {
      name: "setup",
      description:
        "Automatically sets up temporary voice channels under a Rift-managed category channel.",
      options: [
        {
          name: "parent",
          description:
            "Select a parent channel to setup the temporary channels under.",
          type: ApplicationCommandOptionType.String,
          required: false,
          autocomplete: true,
        },
        {
          name: "channel",
          description:
            "Select a channel that will serve as the 'Join to Create' channel for temporary voice channels.",
          type: ApplicationCommandOptionType.String,
          required: false,
          autocomplete: true,
        },
      ],
      category: Category.Voice,
      default_member_permissions: PermissionFlagsBits.ManageChannels,
      dm_permission: false,
      cooldown: 30,
      isDevCommand: true,
    });
  }
  autocomplete(interaction: AutocompleteInteraction) {
    const focused = interaction.options.getFocused(true);
    const choices: { name: string; value: string }[] = [];
    const guild = interaction.guild as Guild;

    switch (focused.name) {
      case "parent":
        {
          guild.channels.cache.forEach((channel) => {
            if (channel.type == ChannelType.GuildCategory)
              choices.push({ name: `${channel.name}`, value: channel.id });
          });
        }
        break;
      case "channel":
        {
          guild.channels.cache.forEach((channel) => {
            if (channel.type == ChannelType.GuildVoice) {
              choices.push({
                name: `${channel.parent?.name || interaction.guild!.name} :: ${
                  channel.name
                }`,
                value: channel.id,
              });
            }
          });
        }
        break;
    }
    const filtered = choices.filter((choice) =>
      choice.name.startsWith(focused.value.toLowerCase())
    );

    return interaction.respond(filtered);
  }
  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild! as Guild;
    let GuildConfig = await TempVCConfig.findOne({
      GuildID: guild.id,
    });

    if (!GuildConfig)
      GuildConfig = await TempVCConfig.create({
        GuildID: guild.id,
        JoinChannelID: interaction.options.getString("channel") || null,
        JoinChannelParent: interaction.options.getString("parent") || null,
      });

    if (!GuildConfig.JoinChannelParent) {
      const createdParent = await guild.channels.create({
        name: "Temporary VCs",
        type: ChannelType.GuildCategory,
      });

      GuildConfig.JoinChannelParent = createdParent.id;
    } else {
      GuildConfig.JoinChannelParent = interaction.options.getString("parent");
    }

    if (!GuildConfig.JoinChannelID) {
      const parent = guild.channels.cache.get(
        GuildConfig.JoinChannelParent!
      ) as CategoryChannel;

      if (!parent)
        return interaction.reply({
          embeds: [
            new EmbedBuilder({
              title: `${this.client!.user!.username} | Error`,
              color: Colors.Red,
              description: `> To automatically setup temporary voice channels, the Join to Create channel needs a parent category.`,
            }),
          ],
          ephemeral: true,
        });

      const createdChannel = await guild.channels.create({
        name: "Join to Create",
        type: ChannelType.GuildVoice,
        parent: parent,
      });

      GuildConfig.JoinChannelID = createdChannel.id;
    } else {
      GuildConfig.JoinChannelID = interaction.options.getString("channel");
    }

    await GuildConfig.save();

    return interaction.reply({
      embeds: [
        new EmbedBuilder({
          title: `Voice | Setup`,
          color: Colors.Red,
          description: `> :white_check_mark: Successfully setup temporary voice channels in this guild.\n> Channel: <#${GuildConfig.JoinChannelID}> | Category: <#${GuildConfig.JoinChannelParent}>`,
        }),
      ],
      ephemeral: true,
    });
  }
}
