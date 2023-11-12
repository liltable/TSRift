import Command from "../../classes/Command.ts";
import {
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
} from "npm:discord.js";
import Category from "../../enum/Category.ts";
import Rift from "../../classes/Rift.ts";

export default class SecretsCommand extends Command {
  constructor(client: Rift) {
    super(client, {
      name: "secrets",
      description:
        "Try to find any secrets the developers inserted in the bot!",
      options: [
        {
          name: "keyword",
          description: "Input a keyword that might trigger a secret!",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
      dm_permission: false,
      cooldown: 30,
      default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
      category: Category.Misc,
      isDevCommand: true,
    });
  }

  execute(interaction: ChatInputCommandInteraction) {
    let Keyword = interaction.options.getString("keyword", true);

    if (Keyword.includes("force")) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setImage(
              "https://cdn.discordapp.com/attachments/1011393179389534229/1172231155307782154/image.png?ex=655f9056&is=654d1b56&hm=c283f06ebec4829bbeba98db0f2cc38ab073840c0bf1a7f59f83f7d68431101d&"
            )
            .setTitle(`${this.client.user?.username} | Secret`)
            .setFooter({ text: "Secret | Force Majeure" }),
        ],
      });
    }
    return interaction.reply({
      content: "No secrets found...",
      ephemeral: true,
    });
  }
}
