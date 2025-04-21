// types/item.ts
export interface IUser {
  _id: string;
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

  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
