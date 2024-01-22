import { model, Schema } from "npm:mongoose";

export const TempVCConfig = model(
  "vc config",
  new Schema({
    GuildID: {
      type: String,
      required: true,
    },
    Enabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    JoinChannelID: {
      type: String,
      required: false,
    },
    JoinChannelParent: {
      type: String,
      required: false,
    },
  })
);
