import Command from "../../classes/Command.ts";
import Rift from "../../classes/Rift.ts";
import Category from "../../enum/Category.ts";
import {
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  GuildMember,
  EmbedBuilder,
  Colors,
} from "npm:discord.js";
import { joinVoiceChannel, getVoiceConnection } from "npm:@discordjs/voice";

export default class JoinVoiceChannel extends Command {
  constructor(client: Rift) {
    super(client, {
      name: "join",
      description: "Joins your current voice channel.",
      options: [],
      category: Category.Voice,
      default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
      cooldown: 10,
      dm_permission: false,
      isDevCommand: false,
      requiresVoice: true,
    });
  }
  execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.member as GuildMember;

    const connection = getVoiceConnection(member.guild.id);
    if (connection) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: `${this.client.user!.username} | Error`,
            color: Colors.Red,
            description: `> :no_entry_sign: I am already in a voice channel!`,
          }),
        ],
        ephemeral: true,
      });
    } else {
      try {
        joinVoiceChannel({
          guildId: member.guild.id,
          channelId: member.voice.channel!.id,
          adapterCreator: member.guild.voiceAdapterCreator,
        });

        return interaction.reply({
          embeds: [
            new EmbedBuilder({
              title: `${this.client.user!.username} | Voice`,
              description: `> :white_check_mark: Successfully joined your voice channel! (<#${
                member.voice.channel!.id
              }>)`,
              color: Colors.Green,
            }),
          ],
        });
      } catch (err) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder({
              title: `${this.client.user!.username} | Error`,
              color: Colors.Red,
              description: `> :no_entry_sign: An error has occurred, failed to join your current voice channel.`,
            }),
          ],
          ephemeral: true,
        });
      }
    }
  }
}
