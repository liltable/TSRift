import Rift from "../classes/Rift.ts";

export default interface IManager {
  client: Rift;
  loadEvents(): void;
  loadCommands(): void;
  loadDatabase(): void;
  loadButtons(): void;
}
