import {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  Guild,
  GuildMember,
  VoiceChannel,
  EmbedBuilder,
  Colors,
} from "npm:discord.js";
import Command from "../../classes/Command.ts";
import Rift from "../../classes/Rift.ts";
import Category from "../../enum/Category.ts";

export default class BanFromVC extends Command {
  constructor(client: Rift) {
    super(client, {
      name: "ban",
      description: "Bans a voice channel member from joining your channel.",
      options: [
        {
          name: "target",
          description: "Select a target to ban.",
          type: ApplicationCommandOptionType.String,
          autocomplete: true,
          required: true,
        },
      ],
      category: Category.Voice,
      cooldown: 30,
      default_member_permissions: PermissionFlagsBits.Connect,
      dm_permission: false,
      isDevCommand: false,
      requiresVoice: true,
    });
  }
  autocomplete(interaction: AutocompleteInteraction) {
    let choices: { name: string; value: string }[] = [];
    const focused = interaction.options.getFocused();
    const guild = interaction.guild as Guild;
    const member = interaction.member as GuildMember;

    guild.members.cache
      .filter(
        (target) =>
          target.user.id !== member.user.id &&
          !target.user.bot &&
          target.voice.channel?.id == member.voice.channel!.id
      )
      .forEach((target) =>
        choices.push({
          name: `${target.user.globalName || target.user.username}`,
          value: `${target.user.id}`,
        })
      );

    if (choices.length > 25) choices = choices.splice(25, choices.length - 25);

    const filtered = choices.filter((target) =>
      target.name.toLowerCase().includes(focused.toLowerCase())
    );

    if (filtered.length < 1)
      filtered.push({ name: "ERROR: There is nobody to ban.", value: "null" });

    return interaction.respond(filtered);
  }
  async execute(interaction: ChatInputCommandInteraction) {
    const targetID = interaction.options.getString("target", true);

    if (targetID == "null")
      return interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: `Voice | Error`,
            description: `> :no_entry_sign: There seems to be nobody to ban in your voice channel.`,
            color: Colors.Red,
          }),
        ],
        ephemeral: true,
      });

    const guild = interaction.guild as Guild;
    const target = guild.members.cache.get(targetID);
    const member = interaction.member as GuildMember;
    const channel = member.voice.channel as VoiceChannel;
    const ownsThisChannel =
      this.client.voiceManager.get(member.id) == channel.id;

    if (!target)
      return interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: `Voice | Invite`,
            description: `> :no_entry_sign: Looks like this is an invalid user. Try again later.`,
            color: Colors.Red,
          }),
        ],
        ephemeral: true,
      });

    if (target.user.bot) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: `Voice | Ban`,
            color: Colors.Red,
            description: `> :no_entry_sign: I can't ban bots from voice channels!`,
          }),
        ],
        ephemeral: true,
      });
    }

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

    if (!target.manageable)
      return interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: `Voice | Error`,
            description: `> :no_entry_sign: I can't ban someone with higher perms than me!`,
            color: Colors.Red,
          }),
        ],
      });
    let disconnected = null;
    try {
      if (target.voice.channel!.id == channel.id) {
        disconnected = await target.voice.disconnect(
          `Banned from temporary voice channel owned by ${
            member.user.globalName || member.user.username
          }.`
        );
      }

      channel.permissionOverwrites.edit(target, { Connect: false });

      target.user.send({
        embeds: [
          new EmbedBuilder({
            title: `Voice | Ban`,
            color: Colors.Red,
            description: `> :no_entry_sign: You've been banned from ${
              member.user.globalName || member.user.username
            }'s voice channel in **${
              guild.name
            }**. You no longer are able to join this channel. (<#${
              channel.id
            }>)`,
          }),
        ],
      });

      return interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: `Voice | Ban`,
            description: `> :no_entry_sign: Banned <@${target.user.id}> from this channel. (<#${channel.id}>)`,
            color: Colors.Red,
          }),
        ],
      });
    } catch (err) {
      if (disconnected)
        return interaction.reply({
          embeds: [
            new EmbedBuilder({
              title: `Voice | Ban`,
              color: Colors.Red,
              description: `> :no_entry_sign: Banned <@${target.user.id}> from this channel. (<#${channel.id}>). They had DM's disabled, so we weren't able to notify them of their ban.`,
            }),
          ],
        });
    }
  }
}
