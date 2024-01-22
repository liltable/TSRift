import Command from "../../classes/Command.ts";
import Rift from "../../classes/Rift.ts";
import {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  Guild,
  GuildMember,
  EmbedBuilder,
  Colors,
  GuildChannel,
  VoiceChannel,
} from "npm:discord.js";
import Category from "../../enum/Category.ts";
import ms from "npm:ms";

export default class InviteToVC extends Command {
  constructor(client: Rift) {
    super(client, {
      name: "invite",
      description: "Invite a friend to your voice channel!",
      options: [
        {
          name: "target",
          description: "Select a target member to invite.",
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: true,
        },
      ],
      cooldown: 30,
      dm_permission: false,
      default_member_permissions: PermissionFlagsBits.CreateInstantInvite,
      category: Category.Voice,
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
      .filter((target) => target.user.id !== member.user.id && !target.user.bot)
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

    return interaction.respond(filtered);
  }
  async execute(interaction: ChatInputCommandInteraction) {
    const targetID = interaction.options.getString("target", true);
    const guild = interaction.guild as Guild;
    const target = guild.members.cache.get(targetID);
    const member = interaction.member as GuildMember;
    const channel = member.voice.channel as VoiceChannel;

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

    const duplicateInvites = guild.invites.cache.filter(
      (invite) =>
        //check if the invite matches the channel we're currently in
        (invite.channel as GuildChannel).id == channel!.id &&
        //check if the invite was created within a three minute period relative to now
        Date.now() - ms("90s") <= invite.createdTimestamp! &&
        invite.createdTimestamp! <= Date.now() + ms("90s")
    );

    if (duplicateInvites.size > 0)
      return interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: `Voice | Error`,
            description: `> :no_entry_sign: An invite has already been issued for this channel. Please wait for that invite to expire before inviting them again.`,
            color: Colors.Red,
          }),
        ],
        ephemeral: true,
      });

    const inviteLink = await guild.invites.create(channel, {
      maxUses: 1,
      reason: `Voice channel invite from ${
        member.user.globalName || member.user.username
      } to ${target.user.globalName || target.user.username}`,
      maxAge: 180,
    });

    const inviteMessage = new EmbedBuilder({
      title: `${this.client.user!.username} | Invite`,
      description: `> You have recieved an invite to join ${
        member.user.globalName || member.user.username
      }'s voice channel in **${
        guild.name
      }**!\n> You have **3 minutes** to join the channel until this invite link expires.\n\n> Link: ${
        inviteLink.url
      }`,
      color: Colors.Blue,
    });

    try {
      target.user.send({ embeds: [inviteMessage] });

      channel.permissionOverwrites.edit(target, { Connect: true });

      return interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: `Voice | Invite`,
            description: `> Successfully invited <@${target.user.id}> to your voice channel. (<#${channel.id}>)`,
            color: Colors.Green,
          }),
        ],
      });
    } catch (err) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: `Voice | Error`,
            description: `> Failed to invite <@${target.user.id}> to your voice channel. They could have turned off DMs.`,
            color: Colors.Red,
          }),
        ],
        ephemeral: true,
      });
    }
  }
}
