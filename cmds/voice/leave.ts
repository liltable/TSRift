import { getVoiceConnection } from "npm:@discordjs/voice";
import Command from "../../classes/Command.ts";
import Rift from "../../classes/Rift.ts";
import Category from "../../enum/Category.ts";
import {
  PermissionFlagsBits,
  EmbedBuilder,
  Colors,
  ChatInputCommandInteraction,
  GuildMember,
} from "npm:discord.js";

export default class LeaveVoiceChannel extends Command {
  constructor(client: Rift) {
    super(client, {
      name: "leave",
      description: "Leaves your current voice channel.",
      options: [],
      category: Category.Voice,
      default_member_permissions: PermissionFlagsBits.Connect,
      cooldown: 10,
      dm_permission: false,
      isDevCommand: false,
    });
  }
  execute(interaction: ChatInputCommandInteraction) {
    const connection = getVoiceConnection(interaction.guild!.id);
    const member = interaction.member as GuildMember;

    if (!member.voice.channel) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: `${this.client.user!.username} | Error`,
            color: Colors.Red,
            description: `> :no_entry_sign: You need to be in a voice channel to use this command!`,
          }),
        ],
        ephemeral: true,
      });
    }

    if (!connection)
      return interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: `${this.client.user!.username} | Error`,
            color: Colors.Red,
            description: `> :no_entry_sign: There isn't a voice channel to leave!`,
          }),
        ],
        ephemeral: true,
      });

    if (connection.joinConfig.channelId != member.voice.channel!.id)
      return interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: `${this.client.user!.username} | Error`,
            color: Colors.Red,
            description: `> :no_entry_sign: You need to be in the same channel as me to use this command!`,
          }),
        ],
        ephemeral: true,
      });
    connection.destroy();
    return interaction.reply({
      embeds: [
        new EmbedBuilder({
          title: `${this.client.user!.username} | Voice`,
          description: `> :white_check_mark: Successfully left your current voice channel. (<#${
            member.voice.channel!.id
          }>)`,
          color: Colors.Orange,
        }),
      ],
    });
  }
}
