import { Events, Message } from "npm:discord.js";
import Event from "../../classes/Event.ts";
import Rift from "../../classes/Rift.ts";
import { Collection } from "npm:discord.js";

export default class SnipeDeletedMessages extends Event {
  constructor(client: Rift) {
    super(client, {
      name: Events.MessageDelete,
      once: false,
    });
  }

  async execute(message: Message) {
    if (!message.guild || message.author.bot) return;
    if (message.partial) await message.fetch();
    const { sniped } = this.client;
    if (!sniped.has(message.guild.id))
      sniped.set(message.guild.id, new Collection());

    let members = sniped.get(message.guild.id)!;
    members.set(message.author.id, message.content);
  }
}
