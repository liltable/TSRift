import Button from "../../classes/Button.ts";
import Rift from "../../classes/Rift.ts";
import {
  ButtonInteraction,
  CacheType,
  PermissionFlagsBits,
} from "npm:discord.js";

export default class Exit extends Button {
  constructor(client: Rift) {
    super(client, {
      name: "Exit",
      id: "exit",
      description: "Exits a button menu by deleting the host message.",
      permission: PermissionFlagsBits.UseApplicationCommands,
    });
  }

  async execute(interaction: ButtonInteraction) {
    if (interaction.message.partial) await interaction.message.fetch();

    if (interaction.message.deletable) return interaction.message.delete();
    else {
      return interaction.reply({
        content: "An error has occured. Please delete this message manually.",
        ephemeral: true,
      });
    }
  }
}
