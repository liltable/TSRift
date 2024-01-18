import { Events } from "npm:discord.js";
import Event from "../../classes/Event.ts";
import Rift from "../../classes/Rift.ts";
import { VoiceState, ChannelType } from "npm:discord.js";
import { TempVCConfig } from "../../schemas/activity.ts";

export default class JoinToCreate extends Event {
  constructor(client: Rift) {
    super(client, {
      name: Events.VoiceStateUpdate,
      once: false,
    });
  }
  async execute(oldState: VoiceState, newState: VoiceState) {
    const { member, guild } = newState;
    const oldChannel = oldState.channel;
    const newChannel = newState.channel;
    const guildConfig = await TempVCConfig.findOne({ GuildID: guild.id });
    if (!guildConfig) return;
    const joinToCreate = guildConfig.JoinChannelID;
    if (!joinToCreate) return;

    if (
      oldChannel !== newChannel &&
      newChannel &&
      newChannel.id === joinToCreate
    ) {
      const voiceChannel = await guild.channels.create({
        type: ChannelType.GuildVoice,
        name: `${member!.user.globalName}'s VC`,
        parent: newChannel.parent,
        permissionOverwrites: [
          { id: member!.id, allow: ["Connect"] },
          { id: guild.id, deny: ["Connect"] },
        ],
      });

      this.client.voiceManager.set(member!.id, voiceChannel.id);
      await newChannel.permissionOverwrites.edit(member!, { Connect: false });
      setTimeout(
        () => newChannel.permissionOverwrites.delete(member!),
        30 * 1000
      );

      return setTimeout(() => member!.voice.setChannel(voiceChannel), 500);
    }

    const ownedChannel = this.client.voiceManager.get(member!.id);

    if (
      ownedChannel &&
      oldChannel!.id === ownedChannel &&
      (!newChannel || newChannel.id !== ownedChannel)
    ) {
      this.client.voiceManager.set(member!.id, null);
      oldChannel!.delete().catch(() => {});
    }
  }
}
