import { Events } from "npm:discord.js";
import IEvent from "../interfaces/IEvent.ts";
import Rift from "./Rift.ts";
import IEventOptions from "../interfaces/IEventOptions.ts";

export default class Event implements IEvent {
  client: Rift;
  name: string;
  once: boolean;
  description?: string | undefined;
  constructor(client: Rift, options: IEventOptions) {
    this.client = client;
    this.name = options.name;
    this.once = options.once;
    this.description = options.description!;
  }

  execute(...args: any): void {}
}
