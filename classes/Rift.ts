// deno-lint-ignore-file
import { Client, Collection } from "npm:discord.js";
import IRift from "../interfaces/IRift.ts";
import IConfig from "../interfaces/IConfig.ts";
import IManager from "../interfaces/IManager.ts";
import Manager from "./Manager.ts";
import * as Config from "../data/config.json" assert { type: "json" };
import Command from "./Command.ts";
import Button from "./Button.ts";

export default class Rift extends Client implements IRift {
  config: IConfig;
  devMode: boolean;
  manager: IManager;
  commands: Collection<string, Command>;
  cooldowns: Collection<string, Collection<string, number>>;
  buttons: Collection<string, Button>;
  cache: Collection<string, any>;
  constructor() {
    super({ intents: 32767 });

    this.devMode = Deno.args.includes("--development");
    this.config = Config.default;
    this.manager = new Manager(this);
    this.commands = new Collection();
    this.cooldowns = new Collection();
    this.buttons = new Collection();
    this.cache = new Collection();
  }

  async init() {
    console.log(`\n
    ██▀███   ██▓  █████▒▄▄▄█████▓
   ▓██ ▒ ██▒▓██▒▓██   ▒ ▓  ██▒ ▓▒
   ▓██ ░▄█ ▒▒██▒▒████ ░ ▒ ▓██░ ▒░
   ▒██▀▀█▄  ░██░░▓█▒  ░ ░ ▓██▓ ░ 
   ░██▓ ▒██▒░██░░▒█░      ▒██▒ ░ 
   ░ ▒▓ ░▒▓░░▓   ▒ ░      ▒ ░░   
     ░▒ ░ ▒░ ▒ ░ ░          ░    
     ░░   ░  ▒ ░ ░ ░      ░      
      ░      ░                   `);
    await this.login(
      this.devMode ? this.config.devToken! : this.config.token!
    ).then(async () => {
      this.load();
    });
  }

  load() {
    this.manager.loadEvents();
    this.manager.loadCommands();
    this.manager.loadDatabase();
    this.manager.loadButtons();
  }
}
