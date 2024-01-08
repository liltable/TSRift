import { model, Schema } from "npm:mongoose";

export const VCActivity = model(
  "vc activity",
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
