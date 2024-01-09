import { ApplicationCommandOptionType } from "npm:discord.js";

export default interface ICommandOptionOptions {
  name: string;
  description?: string;
  type: ApplicationCommandOptionType;
  autocomplete?: boolean;
  required: boolean;
}
