import Event from "../../classes/Event.ts";
import Rift from "../../classes/Rift.ts";
import { Events, AutocompleteInteraction } from "npm:discord.js";

export default class AutocompleteHander extends Event {
  constructor(client: Rift) {
    super(client, {
      name: Events.InteractionCreate,
      description: "Handles autocomplete interactions.",
      once: false,
    });
  }

  async execute(interaction: AutocompleteInteraction) {
    if (!interaction.isAutocomplete()) return;
    const command = this.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      command.autocomplete(interaction);
    } catch (err) {
      console.log(err);
    }
  }
}
