import Event from "../../classes/Event.ts";
import Rift from "../../classes/Rift.ts";
import {
  Events,
  ButtonInteraction,
  EmbedBuilder,
  Colors,
} from "npm:discord.js";

export default class ButtonHandler extends Event {
  constructor(client: Rift) {
    super(client, {
      name: Events.InteractionCreate,
      description: "Passes the button interaction to it's handler.",
      once: false,
    });
  }

  async execute(interaction: ButtonInteraction) {
    if (!interaction.isButton()) return;
    const Button = this.client.buttons.get(interaction.customId)!;
    if (!Button) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(`> This button is outdated!`),
        ],
        ephemeral: true,
      });
    }

    const cachedMemberID = this.client.cache.get(interaction.message.id);

    if (cachedMemberID && interaction.user.id !== cachedMemberID)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(
              `> This button menu isn't for you!\n> It belongs to <@${cachedMemberID}>`
            ),
        ],
        ephemeral: true,
      });

    if (
      Button.permission &&
      (interaction.member!.permissions.valueOf() as bigint) < Button.permission
    )
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(
              `> You are missing the permissions required to run this button!`
            ),
        ],
        ephemeral: true,
      });

    return Button.execute(interaction);
  }
}
