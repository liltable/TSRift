import Command from "../../classes/Command.ts";
import Rift from "../../classes/Rift.ts";
import {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
} from "npm:discord.js";
import Category from "../../enum/Category.ts";

export default class InviteToVC extends Command {
  constructor(client: Rift) {
    super(client, {
      name: "invite",
      description: "Invite a friend to your voice channel!",
      options: [
        {
          name: "target",
          description: "Select a target member to invite.",
          type: ApplicationCommandOptionType.String,
          autocomplete: true,
          required: true,
        },
      ],
      cooldown: 20,
      dm_permission: false,
      default_member_permissions: PermissionFlagsBits.CreateInstantInvite,
      category: Category.Voice,
      isDevCommand: false,
    });
  }
  autocomplete(interaction: AutocompleteInteraction) {}
  execute(interaction: ChatInputCommandInteraction) {}
}
