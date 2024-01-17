import Rift from "../classes/Rift.ts";

export default interface IManager {
  client: Rift;
  loadEvents(reload?: boolean): void;
  loadCommands(reload?: boolean): void;
  loadDatabase(reload?: boolean): void;
  loadButtons(reload?: boolean): void;
}
