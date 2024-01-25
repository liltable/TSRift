import IConfig from "./IConfig.ts";
import IManager from "./IManager.ts";
import { Collection } from "npm:discord.js";
import Command from "../classes/Command.ts";
import Button from "../classes/Button.ts";

export default interface IRift {
  config: IConfig;
  devMode: boolean;
  manager: IManager;
  commands: Collection<string, Command>;
  cooldowns: Collection<string, Collection<string, number>>;
  voiceManager: Collection<string, string | null>;
  buttons?: Collection<string, Button>;
  cache?: Collection<string, any>;
  sniped?: Collection<string, Collection<string, string>>;
}
