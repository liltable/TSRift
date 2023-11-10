import { TextBasedChannel, GuildMember } from "npm:discord.js";

export default interface IClean {
  amount: number;
  target?: GuildMember;
  filter?: string;
  reason?: string;
}
