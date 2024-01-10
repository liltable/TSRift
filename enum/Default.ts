import { ButtonBuilder, ButtonStyle } from "npm:discord.js";

const Default = {
  ExitButton: new ButtonBuilder()
    .setCustomId("exit")
    .setLabel("Exit")
    .setStyle(ButtonStyle.Danger),
};

export default Default;
