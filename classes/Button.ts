import IButton from "../interfaces/IButton.ts";
import Rift from "./Rift.ts";
import IButtonOptions from "../interfaces/IButtonOptions.ts";
import { ButtonInteraction } from "npm:discord.js";

export default class Button implements IButton {
  client: Rift;
  id: string;
  name: string;
  description?: string | undefined;
  permission: bigint;
  constructor(client: Rift, options: IButtonOptions) {
    this.client = client;
    this.id = options.id;
    this.name = options.name!;
    this.description = options.description;
    this.permission = options.permission;
  }

  execute(interaction: ButtonInteraction): void {}
}
