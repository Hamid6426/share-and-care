import mongoose, { Schema } from "mongoose";

function validateImageLimit(val) {
  return val.length <= 4;
}

const ItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    quantity: { type: Number, default: 1, min: 1 },
    category: { type: String, required: true, trim: true },
    condition: {
      type: String,
      enum: ["new", "used", "poor"],
      default: "used",
      required: true,
    },

    images: {
      type: [String],
      validate: [validateImageLimit, "Cannot add more than 4 images"],
      default: [],
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
      required: true,
    },

    donor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", default: null },

    // ——— Track who has requested this item ———
    requesters: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },

    status: {
      type: String,
      enum: [
        "inactive",
        "available",
        "requested",
        "claimed",
        "picked",
        "donated",
      ],
      default: "available",
    },

    // —— Boolean flags for each stage ——
    isRequested: { type: Boolean, default: false },
    requestAccepted: { type: Boolean, default: false },
    requestCancelled: { type: Boolean, default: false },

    isAccepted: { type: Boolean, default: false },
    isCancelled: { type: Boolean, default: false },
    isClaimed: { type: Boolean, default: false },
    isPicked: { type: Boolean, default: false },
    isDonated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Item = mongoose.models.Item || mongoose.model("Item", ItemSchema);

const MONGODB_URI =
  "mongodb+srv://hamid6426:j2JiYZNJciace4Ec@cluster0.aelujm9.mongodb.net/share-and-care-db?retryWrites=true&w=majority&appName=Cluster0";

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    const result = await Item.updateMany(
      { price: { $exists: false } },
      { $set: { price: 0 } }
    );

    console.log(
      `✅ Updated ${result.modifiedCount} items with default price 0.`
    );
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error updating items:", err);
  }
})();
