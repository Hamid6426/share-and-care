// types/IItem.ts
import { IUser } from "./IUser"; // Assuming you have an IUser interface defined

export interface IItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  condition: "new" | "like_new" | "used" | "poor";
  images: string[];
  quantity: number;
  donor: IUser; // populated user object
  receiver?: IUser | null; // populated user object or null
  status: "available" | "reserved" | "donated";
  createdAt: string;
  updatedAt: string;
}
