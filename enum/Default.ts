import { ButtonBuilder, ButtonStyle } from "npm:discord.js";

const Default: any = {
  ExitButton: new ButtonBuilder()
    .setCustomId("exit")
    .setLabel("Exit")
    .setStyle(ButtonStyle.Danger),
};

export default Default;
