import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  GuildMember,
  PermissionFlagsBits,
  EmbedBuilder,
  Colors,
} from "npm:discord.js";
import Command from "../../classes/Command.ts";
import Category from "../../enum/Category.ts";
import Rift from "../../classes/Rift.ts";

export default class RenameVC extends Command {
  constructor(client: Rift) {
    super(client, {
      name: "rename",
      description: "Rename your voice channel.",
      options: [
        {
          name: "to",
          description:
            "Input a new channel name, or type in 'RESET' to revert to the original.",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
      category: Category.Voice,
      dm_permission: false,
      default_member_permissions: PermissionFlagsBits.Connect,
      cooldown: 5,
      isDevCommand: false,
      requiresVoice: true,
    });
  }

  execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.member as GuildMember;
    const channel = member.voice.channel!;
    const newName = interaction.options.getString("to", true);

    const ownsThisChannel =
      this.client.voiceManager.get(member.user.id) == channel.id;

    if (!ownsThisChannel)
      return interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: `Voice | Error`,
            description: `> :no_entry_sign: You don't own this channel, so you don't have permissions to do that!`,
            color: Colors.Red,
          }),
        ],
        ephemeral: true,
      });

    try {
      channel.setName(
        newName == "RESET"
          ? `${member.user.globalName || member.user.username}'s VC`
          : newName
      );
      return interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: `Voice | Rename`,
            description: `Successfully renamed your voice channel to <#${channel.id}>`,
            color: Colors.Green,
          }),
        ],
      });
    } catch (err) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: `Voice | Error`,
            description: `> :no_entry_sign: An error has occured. Your voice channel's name has not been changed.`,
            color: Colors.Red,
          }),
        ],
        ephemeral: true,
      });
    }
  }
}
