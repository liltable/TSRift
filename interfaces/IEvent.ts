import Rift from "../classes/Rift.ts";
import { Events } from "npm:discord.js";

export default interface IEvent {
  client: Rift;
  name: Events;
  description?: string;
  once: boolean;
}
