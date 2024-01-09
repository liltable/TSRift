import {
  ApplicationCommandOptionType,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  Colors,
} from "npm:discord.js";
import Command from "../../classes/Command.ts";
import Rift from "../../classes/Rift.ts";
import Category from "../../enum/Category.ts";

export default class Help extends Command {
  constructor(client: Rift) {
    super(client, {
      name: "help",
      description: "Returns information about every command.",
      category: Category.Util,
      options: [
        {
          name: "command",
          description: "Specify a command to receive in-depth info about.",
          required: false,
          autocomplete: true,
          type: ApplicationCommandOptionType.String,
        },
      ],
      cooldown: 10,
      isDevCommand: false,
      default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
      dm_permission: false,
    });
  }
  autocomplete(interaction: AutocompleteInteraction) {
    const choices: { name: string; value: string }[] = [];
    this.client.commands
      .filter((cmd) => !cmd.isDevCommand)
      .forEach((cmd) =>
        choices.push({
          name: `${cmd.category} :: ${cmd.name}`,
          value: cmd.name,
        })
      );

    const focused = interaction.options.getFocused().toLowerCase();
    const filtered = choices.filter((choice) =>
      choice.value.startsWith(focused)
    );

    return interaction.respond(filtered);
  }
  execute(interaction: ChatInputCommandInteraction) {
    const detailedCMD = interaction.options.getString("command");

    switch (!detailedCMD) {
      //no selected detailed command, return giant help embed
      case true: {
        const cmdList = this.client.commands.map(
          (cmd) => `> **${cmd.name}** | *${cmd.description}*`
        );

        const HelpEmbed = new EmbedBuilder({
          title: `${this.client.user!.username} | Help`,
          color: Colors.White,
          description: `> ${cmdList.join(`\n`).toString()}`,
        });

        return interaction.reply({ embeds: [HelpEmbed], ephemeral: true });
      }
      //detailed command selected, return specific info about that command
      case false: {
        const cmd = this.client.commands.get(detailedCMD!);

        if (!cmd)
          return interaction.reply({
            content:
              "This command is outdated, please wait for the bot to update.",
            ephemeral: true,
          });

        const opDesc =
          cmd.options.length > 0
            ? `${cmd.options
                .map(
                  (op) =>
                    `> *${op.name}* | ${op.description} (${
                      op.required ? `**requrired**` : `optional`
                    })`
                )
                .join(`\n`)
                .toString()}`
            : ``;

        const HelpEmbed = new EmbedBuilder({
          title: `Help | ${cmd.name} (${cmd.category})`,
          color: Colors.White,
          description: `*${cmd.description}*\n\n${opDesc}`,
        });

        return interaction.reply({ embeds: [HelpEmbed], ephemeral: true });
      }
    }
  }
}
