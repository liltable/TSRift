import Command from "../../classes/Command.ts";
import Rift from "../../classes/Rift.ts";
import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  Events,
  AutocompleteInteraction,
  ApplicationCommandOptionType,
} from "npm:discord.js";
import Category from "../../enum/Category.ts";

export default class Emit extends Command {
  constructor(client: Rift) {
    super(client, {
      name: "emit",
      description: "Emits a client event for testing purposes.",
      options: [
        {
          name: "event",
          description: "Select a client event to emit.",
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: true,
        },
      ],
      isDevCommand: true,
      default_member_permissions: PermissionFlagsBits.Administrator,
      category: Category.Dev,
      cooldown: 10,
      dm_permission: false,
    });
  }

  execute(interaction: ChatInputCommandInteraction) {}
  autocomplete(interaction: AutocompleteInteraction) {
    const focused = interaction.options.getFocused();
    const events: string[] = Object.keys(Events);
    let choices: { name: string; value: string }[] = events.map((event) => {
      return { name: event.replace(/([A-Z])/g, " ").trim(), value: event };
    });

    if (choices.length > 25) choices = choices.splice(25, choices.length - 25);

    return interaction.respond(
      choices.filter((choice) =>
        choice.name.toLowerCase().includes(focused.toLowerCase())
      )
    );
  }
}
