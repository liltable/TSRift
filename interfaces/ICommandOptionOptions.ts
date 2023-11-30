import { ApplicationCommandOptionType } from "npm:discord.js";

export default interface ICommandOptionOptions {
  name: string;
  type: ApplicationCommandOptionType;
  required: boolean;
}
