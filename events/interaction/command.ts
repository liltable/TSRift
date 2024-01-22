import {
  ChatInputCommandInteraction,
  Events,
  EmbedBuilder,
  Colors,
  Collection,
  GuildMember,
} from "npm:discord.js";
import Event from "../../classes/Event.ts";
import Rift from "../../classes/Rift.ts";

export default class CommandHandler extends Event {
  constructor(client: Rift) {
    super(client, {
      name: Events.InteractionCreate,
      description: "Passes the command interaction to it's handler.",
      once: false,
    });
  }

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    const Command = this.client.commands.get(interaction.commandName);
    if (!Command) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(`> This command is outdated!`),
        ],
        ephemeral: true,
      });

      return this.client.commands.delete(interaction.commandName);
    }

    if (
      Command.isDevCommand &&
      interaction.guild?.id !== this.client.config.homeGuild
    ) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(`> This is a development command!`),
        ],
        ephemeral: true,
      });

      return interaction.guild?.commands.cache.delete(interaction.commandName);
    }

    if (
      Command.requiresVoice &&
      !(interaction.member as GuildMember).voice.channel
    ) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: `${this.client.user!.username} | Error`,
            color: Colors.Red,
            description: `> :no_entry_sign: You need to be in a voice channel to use this command!`,
          }),
        ],
        ephemeral: true,
      });
    }

    const { cooldowns } = this.client;

    if (!cooldowns.has(Command.name))
      cooldowns.set(Command.name, new Collection());

    const now = Date.now();
    const timestamps = cooldowns.get(Command.name)!;
    const amount = (Command.cooldown || 3) * 1000;

    if (
      timestamps.has(interaction.user.id) &&
      now < (timestamps.get(interaction.user.id) || 0) + amount
    ) {
      const remaining = (
        ((timestamps.get(interaction.user.id) || 0) + amount - now) /
        1000
      ).toFixed(2);

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(
              `> This command is on cooldown for \`${remaining}\` seconds.`
            ),
        ],
        ephemeral: true,
      });
    }
    timestamps.set(interaction.user.id, now);
    setTimeout(() => {
      timestamps.delete(interaction.user.id);
    }, amount);

    return Command.execute(interaction);
  }
}
