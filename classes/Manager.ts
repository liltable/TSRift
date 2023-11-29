import IManager from "../interfaces/IManager.ts";
import glob from "npm:glob@4.0.0";
import { promisify } from "node:util";
import Event from "./Event.ts";
import Rift from "./Rift.ts";
import Command from "./Command.ts";
import { connect } from "npm:mongoose";
import Button from "./Button.ts";

export default class Manager implements IManager {
  client: Rift;
  constructor(client: Rift) {
    this.client = client;
  }

  private async loadFiles(dirName: string) {
    const pg = promisify(glob);
    const Files: string[] = await pg(`${Deno.cwd()}/${dirName}/**/*.ts`);
    return Files;
  }

  async loadEvents() {
    const Files = await this.loadFiles("events");

    Files.forEach(async (path: string) => {
      const pseudofile = await import(`file://${path}`);
      const event: Event = new pseudofile.default(this.client);
      if (!event.name) {
        return console.log(`${path.split("/").pop()} does not have a name!`);
      }
      const execute = (...args: any) => event.execute(...args);

      if (event.once) {
        this.client.once(event.name.toString(), execute);
      } else {
        this.client.on(event.name.toString(), execute);
      }
    });
    return console.log(`Loaded ${Files.length} client event(s).`);
  }

  async loadCommands() {
    const Files: string[] = await this.loadFiles("cmds");

    this.client.application?.commands.cache.clear();
    this.client.commands.clear();
    this.client.guilds.cache
      .get(this.client.config.homeGuild!)
      ?.commands.cache.clear();

    Files.forEach(async (path: string) => {
      const pseudofile = await import(`file://${path}`);
      const command: Command = new pseudofile.default(this.client);

      if (!command.name)
        return console.log(`${path.split("/").pop} does not have a name!`);

      this.client.commands.set(command.name, command);
    });
  }

  async loadButtons() {
    const Files: string[] = await this.loadFiles("btns");
    Files.forEach(async (path: string) => {
      const pseudofile = await import(`file://${path}`);
      const button: Button = new pseudofile.default(this.client);

      if (!button.id) {
        return console.log(`${path.split("/").pop()} does not have an ID!`);
      }

      this.client.buttons.set(button.id, button);
    });
  }

  async loadDatabase() {
    await connect(this.client.config.database!)
      .then(() => console.log(`Connected to MongoDB.`))
      .catch((err) => console.log(err));
  }
}
