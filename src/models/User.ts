import mongoose, { Schema, Document } from "mongoose";

// Define the User document interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;

  isVerified?: boolean;
  verifiedAt?: Date;
  verificationToken?: string;
  verificationTokenExpire?: Date;

  country?: string;
  state?: string;
  city?: string;
  street?: string;
  zipCode?: string;
  address?: string;
  phone?: string;

  whatsapp?: string;
  telegram?: string;
  discord?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  tiktok?: string;

  bio?: string;
  profilePicture?: string;
}

// Create the User schema
const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["receiver", "donor", "admin", "superadmin"],
      required: true,
      default: "receiver",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    verificationTokenExpire: {
      type: Date,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    street: {
      type: String,
      default: null,
    },
    zipCode: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    whatsapp: {
      type: String,
      default: null,
    },
    telegram: {
      type: String,
      default: null,
    },
    discord: {
      type: String,
      default: null,
    },
    facebook: {
      type: String,
      default: null,
    },
    twitter: {
      type: String,
      default: null,
    },
    instagram: {
      type: String,
      default: null,
    },
    linkedin: {
      type: String,
      default: null,
    },
    tiktok: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    profilePicture: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the User model or reuse the existing one
export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
