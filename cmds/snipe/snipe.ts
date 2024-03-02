import {
  ApplicationCommandOptionType,
  AutocompleteInteraction,
  Guild,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
} from "npm:discord.js";
import Command from "../../classes/Command.ts";
import Rift from "../../classes/Rift.ts";
import Category from "../../enum/Category.ts";

export default class SnipeLatestMessage extends Command {
  constructor(client: Rift) {
    super(client, {
      name: "snipe",
      description: "Retrieve the last deleted message from a target.",
      options: [
        {
          name: "target",
          description: "Select a target.",
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: true,
        },
      ],
      category: Category.Misc,
      default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
      cooldown: 10,
      dm_permission: false,
      isDevCommand: false,
    });
  }

  autocomplete(interaction: AutocompleteInteraction) {
    const focused = interaction.options.getFocused();
    const choices: { name: string; value: string }[] = [];
    const guild = interaction.guild as Guild;

    guild.members.cache.forEach((member) => {
      if (!member.user.bot)
        choices.push({
          name:
            member.nickname || member.user.globalName || member.user.username,
          value: member.user.id,
        });
    });

    let filtered = choices.filter((member) =>
      member.name.toLowerCase().includes(focused.toLowerCase())
    );

    if (filtered.length > 25)
      filtered = filtered.splice(25, filtered.length - 25);
    if (filtered.length < 1)
      filtered.push({ name: `There isn't anyone to select.`, value: "null" });

    return interaction.respond(filtered);
  }

  execute(interaction: ChatInputCommandInteraction) {
    const targetID = interaction.options.getString("target", true);
    const guild = interaction.guild as Guild;
    if (targetID == "null")
      return interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: `Snipe | Error`,
            color: Colors.Red,
            description: `> :no_entry_sign: There isn't a target to snipe!`,
          }),
        ],
        ephemeral: true,
      });
    const target = guild.members.cache.get(targetID);
    if (!target)
      return interaction.reply({
        content: "This is an invalid user.",
        ephemeral: true,
      });

    const snipedMessages = this.client.sniped.get(guild.id);
    if (!snipedMessages)
      return interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: `Snipe | Error`,
            color: Colors.Red,
            description: `> :no_entry_sign: Nobody from this server has been sniped yet!`,
          }),
        ],
      });

    const snipedMessage = snipedMessages.get(target.user.id);

    if (!snipedMessage)
      return interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: `Snipe | ${
              target.nickname || target.user.globalName || target.user.username
            }`,
            description: `There isn't a message to snipe!`,
            color: Colors.Red,
          }),
        ],
        ephemeral: true,
      });
    return interaction.reply({
      embeds: [
        new EmbedBuilder({
          title: `Snipe | ${
            target.nickname || target.user.globalName || target.user.username
          }`,
          description: `\`\`\`${snipedMessage}\`\`\``,
          color: Colors.Blurple,
        }),
      ],
    });
  }
}
