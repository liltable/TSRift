import Button from "../../classes/Button.ts";
import {
  PermissionFlagsBits,
  ButtonInteraction,
  EmbedBuilder,
  Colors,
} from "npm:discord.js";
import Rift from "../../classes/Rift.ts";
import Storage from "../../schemas/guild.ts";

export default class ToggleLogsButton extends Button {
  constructor(client: Rift) {
    super(client, {
      name: "Toggle Logs Button",
      id: "toggleLogs",
      permission: PermissionFlagsBits.ManageGuild,
    });
  }

  async execute(interaction: ButtonInteraction) {
    const Config = await Storage.findOne({ guildID: interaction.guild!.id });

    const Toggle = Config!.logs!.enabled ? false : true;

    Config!.logs!.enabled = Toggle;
    await Config!.save();

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(Toggle ? Colors.Green : Colors.Red)
          .setDescription(
            `> Successfully toggled logging for this guild **${
              Toggle ? "on" : "off"
            }**.`
          ),
      ],
      ephemeral: true,
    });
  }
}
