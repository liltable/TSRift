import { ApplicationCommandOptionType } from "npm:discord.js";
import ICommandOptionChoiceOptions from "./ICommandOptionChoiceOptions.ts";

export default interface ICommandOptionOptions {
  name: string;
  description: string;
  type: ApplicationCommandOptionType;
  autocomplete?: boolean;
  required: boolean;
  choices?: ICommandOptionChoiceOptions[];
}
