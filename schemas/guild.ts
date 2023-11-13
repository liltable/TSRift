import { model, Schema } from "npm:mongoose";

const storage = model(
  "rift",
  new Schema({
    guildID: { type: String, required: true },
    logs: {
      enabled: { type: Boolean, required: true, default: false },
      channelID: { type: String, required: true, default: null },
    },
  })
);

export default storage;
