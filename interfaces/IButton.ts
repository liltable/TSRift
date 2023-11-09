import Rift from "../classes/Rift.ts";

export default interface IButton {
  client: Rift;
  name: string;
  description?: string;
  permission: bigint;
}
