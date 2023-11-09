import Rift from "../classes/Rift.ts";

export default interface IEvent {
  client: Rift;
  name: string;
  description?: string;
  once: boolean;
}
