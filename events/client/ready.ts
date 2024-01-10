import { ActivityType, Events, REST, Routes, Collection } from "npm:discord.js";
import Event from "../../classes/Event.ts";
import Rift from "../../classes/Rift.ts";
import Command from "../../classes/Command.ts";

export default class Ready extends Event {
  constructor(client: Rift) {
    super(client, {
      name: Events.ClientReady,
      description:
        "Updates the CLI when the client is connected and ready for use.",
      once: true,
    });
  }
  async execute() {
    this.client.user?.setPresence({
      status: this.client.devMode ? "dnd" : "idle",
      activities: [
        {
          name: `in ${this.client.devMode ? "development" : "release"} mode...`,
          type: ActivityType.Watching,
        },
      ],
    });

    const clientID = this.client.devMode
      ? this.client.config.devClientID!
      : this.client.config.clientID!;

    const rest = new REST().setToken(
      this.client.devMode
        ? this.client.config.devToken
        : this.client.config.token
    );

    if (this.client.devMode) {
      const devCommands: any = await rest.put(
        Routes.applicationGuildCommands(
          clientID,
          this.client.config.homeGuild!
        ),
        {
          body: this.getJson(
            this.client.commands.filter((cmd) => cmd.isDevCommand)
          ),
        }
      );

      console.log(
        `| :: Loaded ${devCommands.length} developer application (/) commands.`
      );
    }

    const globalCommands: any = await rest.put(
      Routes.applicationCommands(clientID),
      {
        body: this.getJson(
          this.client.commands.filter((cmd) => !cmd.isDevCommand)
        ),
      }
    );
    console.log(
      `| :: Loaded ${globalCommands.length} global application (/) commands.`
    );

    return console.log(
      `| :: Logged in with account ${this.client.user?.tag} in ${
        this.client.devMode ? "development" : "release"
      } mode.`
    );
  }

  private getJson(commands: Collection<string, Command>) {
    const data: object[] = [];

    commands.forEach((cmd) => {
      data.push({
        name: cmd.name,
        description: cmd.description,
        options: cmd.options,
        default_member_permissions: cmd.default_member_permissions.toString(),
        dm_permission: cmd.dm_permission,
      });
    });

    return data;
  }
}
