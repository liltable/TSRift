import {
  ButtonInteraction,
  EmbedBuilder,
  Colors,
  PermissionFlagsBits,
  GuildTextBasedChannel,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "npm:discord.js";
import Button from "../../classes/Button.ts";
import Rift from "../../classes/Rift.ts";
import IClean from "../../interfaces/IClean.ts";

export default class CleanButton extends Button {
  constructor(client: Rift) {
    super(client, {
      name: "Clean",
      id: "clean",
      permission: PermissionFlagsBits.UseApplicationCommands,
    });
  }

  private removeDupes(arr: any[]) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
  }

  async execute(interaction: ButtonInteraction) {
    const channel = interaction.channel as GuildTextBasedChannel;
    const cacheID = `${interaction.message.id}:clean`;

    const Config: IClean = this.client.cache.get(cacheID);
    if (!Config || !Config.amount) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(`> This button menu has expired!`),
        ],
        ephemeral: true,
      });

      if (interaction.message.deletable) {
        await interaction.message.delete();
      }
    }

    let FilteredMessages: any[] = [];
    const Messages = await channel.messages.fetch({
      limit: Math.max(Config.amount + 1, 100),
    });

    if (Config.target) {
      Messages.forEach(async (msg) => {
        if (msg.partial) await msg.fetch();
        const match = msg.author.id === Config.target!.id;
        if (match) FilteredMessages.push(msg);

        FilteredMessages.forEach((msg, index) => {
          if (msg.author.id !== Config.target!.id) {
            FilteredMessages.splice(index, 1);
          }
        });
      });
    }

    if (Config.filter) {
      Messages.forEach(async (msg) => {
        if (msg.partial) await msg.fetch();

        const match = msg.content
          .toLowerCase()
          .includes(Config.filter!.toLowerCase());
        if (match) FilteredMessages.push(msg);

        FilteredMessages.forEach((msg, index) => {
          const match = msg.content
            .toLowerCase()
            .includes(Config.filter!.toLowerCase());
          if (!match) FilteredMessages.splice(index, 1);
        });
      });
    }

    FilteredMessages = this.removeDupes(FilteredMessages);

    await channel.bulkDelete(FilteredMessages, true);

    let Amount = Config.amount;
    if (FilteredMessages.length > 0) {
      Amount = FilteredMessages.length;
    }

    const embDesc = [
      `> Successfully deleted ${Amount} message(s) from this channel.`,
    ];

    if (Config.filter) embDesc.push(`> Keyword: ${Config.filter}`);
    if (Config.reason) embDesc.push(`> Reason: ${Config.reason}`);
    if (Config.target)
      embDesc.push(`> Target: ${Config.target || "`Failed to fetch.`"}`);
    if (Config.amount >= 50)
      embDesc.push(
        `> Please note that it may take a few seconds for the deletions to process.`
      );

    const Embed = new EmbedBuilder()
      .setColor(Colors.Orange)
      .setDescription(embDesc.join(`\n`).toString());

    await interaction.reply({
      embeds: [Embed],
      components: [
        //@ts-ignore balls
        new ActionRowBuilder().setComponents(
          new ButtonBuilder()
            .setCustomId("exit")
            .setLabel("Exit")
            .setStyle(ButtonStyle.Danger)
        ),
      ],
    });

    return this.client.cache.set(
      (await interaction.fetchReply()).id,
      interaction.user.id
    );
  }
}
