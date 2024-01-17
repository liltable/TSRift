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

export default class Reload extends Command {
  constructor(client: Rift) {
    super(client, {
      name: "reload",
      description: "Reloads core properties of the client.",
      options: [
        {
          name: "property",
          description: "Select what client core property to reload.",
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: true,
        },
      ],
      category: Category.Dev,
      dm_permission: false,
      default_member_permissions: PermissionFlagsBits.Administrator,
      cooldown: 30,
      isDevCommand: true,
    });
  }

  execute(interaction: ChatInputCommandInteraction) {
    type possibilities =
      | "cmds"
      | "events"
      | "buttons"
      | "database"
      | "cooldowns";
    const property = interaction.options.getString("property") as possibilities;

    switch (property) {
      case "cmds":
        try {
          this.client.manager.loadCommands(true);
          return interaction.reply({
            embeds: [
              new EmbedBuilder({
                title: `${this.client.user!.username} | Reload`,
                description: `> :white_check_mark: Successfully reloaded the client's commands!`,
                color: Colors.Green,
              }),
            ],
            ephemeral: true,
          });
        } catch (err) {
          return interaction.reply({
            embeds: [
              new EmbedBuilder({
                title: `${this.client.user!.username} | Reload`,
                description: `> :no_entry: Client commands reload failed.`,
                color: Colors.Red,
              }),
            ],
            ephemeral: true,
          });
        }
      case "events":
      case "buttons":
      case "database":
      case "cooldowns":
    }
  }
  autocomplete(interaction: AutocompleteInteraction) {
    const focused = interaction.options.getFocused();
    const choices: { name: string; value: string }[] = [
      { name: "Commands", value: "cmds" },
      { name: "Events", value: "events" },
      { name: "Buttons", value: "buttons" },
      { name: "Database Connection", value: "database" },
      { name: "Interaction Cooldowns", value: "cooldowns" },
    ];

    return interaction.respond(
      choices.filter((choice) =>
        choice.name.toLowerCase().includes(focused.toLowerCase())
      )
    );
  }
}
