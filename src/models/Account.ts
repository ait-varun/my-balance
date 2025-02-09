import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAccount extends Document {
  userId: string;
  month: string;
  startingBalance: number;
  salary: number;
  emi: number;
  expenses: number;
  savings: number;
  totalSaved: number;
  closingBalance: number;
}

const AccountSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    month: { type: String, required: true },
    startingBalance: { type: Number, required: true },
    salary: { type: Number, required: true },
    emi: { type: Number, required: true },
    expenses: { type: Number, required: true },
    savings: { type: Number, required: true },
    totalSaved: { type: Number, required: true },
    closingBalance: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Account: Model<IAccount> =
  mongoose.models.Account || mongoose.model<IAccount>("Account", AccountSchema);
