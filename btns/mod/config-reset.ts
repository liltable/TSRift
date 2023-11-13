import Button from "../../classes/Button.ts";
import Rift from "../../classes/Rift.ts";
import {
  PermissionFlagsBits,
  ButtonInteraction,
  EmbedBuilder,
  Colors,
} from "npm:discord.js";
import Storage from "../../schemas/guild.ts";

export default class ResetConfigButton extends Button {
  constructor(client: Rift) {
    super(client, {
      name: "Reset Config",
      id: "configReset",
      permission: PermissionFlagsBits.ManageGuild,
    });
  }

  async execute(interaction: ButtonInteraction) {
    const Config = await Storage.findOne({ guildID: interaction.guild!.id });

    if (!Config) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(`> This guild has no config set!`),
        ],
        ephemeral: true,
      });
    } else {
      await Storage.findOneAndDelete({
        guildID: interaction.guild!.id,
      })
        .then(() => {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(Colors.Green)
                .setDescription(
                  `> Successfully reset this guild's Rift configuration.`
                ),
            ],
          });
        })
        .catch((err) => console.log(err));
    }
  }
}
