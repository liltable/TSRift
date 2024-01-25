// deno-lint-ignore-file
import { Client, Collection } from "npm:discord.js";
import IRift from "../interfaces/IRift.ts";
import IConfig from "../interfaces/IConfig.ts";
import IManager from "../interfaces/IManager.ts";
import Manager from "./Manager.ts";
import * as Config from "../data/config.json" assert { type: "json" };
import Command from "./Command.ts";
import Button from "./Button.ts";
import { GatewayIntentBits, Partials } from "npm:discord.js";

export default class Rift extends Client implements IRift {
  config: IConfig;
  devMode: boolean;
  manager: IManager;
  commands: Collection<string, Command>;
  cooldowns: Collection<string, Collection<string, number>>;
  buttons: Collection<string, Button>;
  cache: Collection<string, any>;
  voiceManager: Collection<string, string | null>;
  sniped: Collection<string, Collection<string, string>>;
  constructor() {
    super({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
      ],
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.User,
        Partials.Message,
      ],
    });

    this.devMode = Deno.args.includes("--development");
    this.config = Config.default;
    this.manager = new Manager(this);
    this.commands = new Collection();
    this.cooldowns = new Collection();
    this.buttons = new Collection();
    this.cache = new Collection();
    this.voiceManager = new Collection();
    this.sniped = new Collection();
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
