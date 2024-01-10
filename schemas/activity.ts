import { model, Schema } from "npm:mongoose";

export const TempVCConfig = model(
  "vc config",
  new Schema({
    GuildID: {
      type: String,
      required: true,
    },
    JoinChannelID: {
      type: String,
      required: true,
    },
    JoinChannelParent: {
      type: String,
      required: false,
    },
  })
);
