import { Events } from "npm:discord.js";

export default interface IEventOptions {
  name: Events;
  description?: string;
  once: boolean;
}
