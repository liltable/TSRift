import {
  ApplicationCommandOptionType,
  AutocompleteInteraction,
  ChannelType,
  ChatInputCommandInteraction,
  GuildMember,
  PermissionFlagsBits,
  EmbedBuilder,
  Colors,
  Guild,
} from "npm:discord.js";
import Command from "../../classes/Command.ts";
import Rift from "../../classes/Rift.ts";
import Category from "../../enum/Category.ts";
import { TempVCConfig } from "../../schemas/activity.ts";

export default class SetupTempVCs extends Command {
  constructor(client: Rift) {
    super(client, {
      name: "config",
      description: "Setup how Rift manages your temporary voice channels.",
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
    const member = interaction.member as GuildMember;
    const embedDescription: string[] = [];
    let GuildConfig = await TempVCConfig.findOne({ GuildID: member.guild.id });

    if (!GuildConfig)
      //if there isn't one, create a filler one that we can actively update on the fly.
      GuildConfig = await TempVCConfig.create({
        GuildID: member.guild.id,
        JoinChannelID: null,
        JoinChannelParent: null,
      });

    const parentToSet = interaction.options.getString("parent");
    const channelToSet = interaction.options.getString("channel");

    if (parentToSet) {
      GuildConfig.JoinChannelParent = parentToSet;
    }

    if (channelToSet) {
      GuildConfig.JoinChannelID = channelToSet;
    }

    try {
      await GuildConfig.save();
    } catch (err) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: `Voice | Error`,
            description: `An error has occured. Your server config hasn't been updated.`,
            color: Colors.Red,
          }),
        ],
      });
    }

    embedDescription.push(
      `> Your join channel is <#${GuildConfig.JoinChannelParent}>`
    );
    embedDescription.push(
      `> Your join channel parent is <#${GuildConfig.JoinChannelID}>`
    );

    return interaction.reply({
      embeds: [
        new EmbedBuilder({
          title: `Voice | Setup`,
          description: `> :white_check_mark: Successfully updated your server config!\n${embedDescription
            .join(`\n`)
            .toString()}`,
          color: Colors.Green,
        }),
      ],
    });
  }
}
