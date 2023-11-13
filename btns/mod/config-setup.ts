import Button from "../../classes/Button.ts";
import Rift from "../../classes/Rift.ts";
import ms from "npm:ms";
import {
  PermissionFlagsBits,
  ButtonInteraction,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  ModalSubmitInteraction,
  TextInputStyle,
  GuildBasedChannel,
  EmbedBuilder,
  Colors,
  ButtonBuilder,
  ButtonStyle,
} from "npm:discord.js";
import Storage from "../../schemas/guild.ts";
import Default from "../../enum/Default.ts";

export default class ConfigSetupButton extends Button {
  constructor(client: Rift) {
    super(client, {
      name: "Config Setup",
      id: "configSetup",
      permission: PermissionFlagsBits.ManageGuild,
    });
  }

  async execute(interaction: ButtonInteraction) {
    const Modal = new ModalBuilder()
      .setTitle(`${this.client.user!.username} | Setup`)
      .setCustomId("configSetupModal")
      .setComponents(
        //@ts-ignore cope
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setStyle(TextInputStyle.Short)
            .setLabel("Config | Logging")
            .setPlaceholder("Input the name of your desired logging channel.")
            .setCustomId("logChannel")
        )
      );

    await interaction.showModal(Modal);

    const filter = (interaction: ModalSubmitInteraction) =>
      interaction.customId === "configSetupModal";
    interaction
      .awaitModalSubmit({ filter, time: ms("10s") })
      .then(async (newInteraction) => {
        const searchTerm =
          newInteraction.fields.getTextInputValue("logChannel");
        const channel = newInteraction.guild?.channels.cache.find(
          //@ts-ignore mmmm fiji
          (channel: GuildBasedChannel) =>
            channel.name.includes(searchTerm) || channel.id === searchTerm
        );
        if (!channel) {
          return newInteraction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(
                  `> Couldn't find your inputted logging channel!\n> Try inputting the ID of the channel instead.`
                ),
            ],
            ephemeral: true,
          });
        }

        const Duplicate = await Storage.findOne({
          guildID: newInteraction.guild!.id,
        });

        if (Duplicate) {
          return newInteraction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`> Setup has already been completed!`),
            ],
            components: [
              //@ts-ignore balls
              new ActionRowBuilder().setComponents(
                new ButtonBuilder()
                  .setLabel("Reset")
                  .setStyle(ButtonStyle.Danger)
                  .setCustomId("configReset"),
                Default.ExitButton
              ),
            ],
          });
        } else {
          await Storage.create({
            guildID: newInteraction.guild!.id,
            logs: {
              enabled: true,
              channelID: channel.id,
            },
          });

          return newInteraction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(Colors.Green)
                .setTitle(`${this.client.user!.username} | Setup`)
                .setDescription(
                  `> Setup complete! Logging has been enabled at ${channel}!`
                ),
            ],
            components: [
              //@ts-ignore MAX VERSTAPPEN
              new ActionRowBuilder().setComponents(Default.ExitButton),
            ],
          });
        }
      });
  }
}
