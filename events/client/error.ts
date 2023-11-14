import Event from "../../classes/Event.ts";
import {
  Events,
  EmbedBuilder,
  Colors,
  GuildTextBasedChannel,
} from "npm:discord.js";
import Rift from "../../classes/Rift.ts";

export default class Error extends Event {
  constructor(client: Rift) {
    super(client, {
      name: Events.Error,
      once: false,
    });
  }

  async execute(err: Error) {
    console.log(err);

    const errChannel = (await this.client.channels.fetch(
      this.client.config.errorChannel!
    )) as GuildTextBasedChannel;
    if (!errChannel)
      return console.log(
        `Failed to notify to Discord: error channel not found.`
      );

    const ErrorEmbed = new EmbedBuilder()
      .setColor(Colors.Red)
      .setTitle(`${this.client.user!.username} | Error`)
      .setDescription(`Error: \`${err.name}\`\nStack:\n \`${err}\``);

    await errChannel
      .send({ embeds: [ErrorEmbed] })
      .then(() => console.log(`Notified error to Discord.`));
  }
}
