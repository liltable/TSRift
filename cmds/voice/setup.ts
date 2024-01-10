import {
  ApplicationCommandOptionType,
  AutocompleteInteraction,
  CacheType,
  ChannelType,
  ChatInputCommandInteraction,
  Guild,
  PermissionFlagsBits,
} from "npm:discord.js";
import Command from "../../classes/Command.ts";
import Rift from "../../classes/Rift.ts";
import Category from "../../enum/Category.ts";

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
      isDevCommand: false,
    });
  }
  autocomplete(interaction: AutocompleteInteraction) {
    const focused = interaction.options.getFocused(true);
    const choices: { name: string; value: string }[] = [];

    switch (focused.name) {
      case "parent":
        {
          (interaction.guild as Guild).channels.cache.forEach((channel) => {
            if (channel.type == ChannelType.GuildCategory)
              choices.push({ name: `${channel.name}`, value: channel.id });
          });
        }
        break;
      case "channel":
        {
          (interaction.guild as Guild).channels.cache.forEach((channel) => {
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
  execute(interaction: ChatInputCommandInteraction) {}
}
