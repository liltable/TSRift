import { model, Schema } from "npm:mongoose";

const playerbase = model(
  "rift playerbase",
  new Schema({
    id: { type: String, required: true },
    xp: { type: Number, required: true, default: 0 },
    level: { type: Number, required: true, default: 1 },
    skillPoints: {
      type: Number,
      required: true,
      default: 0,
    },
    inventory: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        amount: { type: Number, required: true },
        type: { type: Number, required: true, enum: [1, 2, 3, 4, 5, 6, 7] },
      },
    ],
  })
);

export default playerbase;
