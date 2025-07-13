import mongoose, { Schema } from "mongoose";


export interface iprogress extends Document {
  bookName: string;
  progressPercentage: number;
  currentPageNumber: number;
  totalPage_book: number;
}
export interface Iuser extends Document {
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  verfiyCode: number;
  avatar: string;
  verifyCodeExpiry: Date;
  forgotPassword_otp: string;
  forgotPassword_otp_Expiry: Date;
  isPremiumMember: boolean;
  MemberType: String;
  downloadCount: number;
  isAdmin: boolean;
  progress: iprogress[];
}

export const userSchema: Schema<Iuser> = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    requried: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verfiyCode: {
    type: Number,
    required: [true, "verify code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    requierd: [true, "verify code expiry is required"],
  },
  forgotPassword_otp: String,
  forgotPassword_otp_Expiry: Date,
  isPremiumMember: {
    type: Boolean,
    default: false,
  },
  MemberType: {
    type: String,
    enum: ["basic", "standard", "premium"],
    default: "basic"
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
  isAdmin:{
    type:Boolean,
    default:true
  },
  progress: [
    {
      bookName: {
        type: mongoose.Schema.ObjectId,
        ref: "Book",
      },
      progressPercentage: Number,
      currentPageNumber: Number,
      totalPage_book:Number
    },
  ],
});

export const userModel =
  (mongoose.models.User as mongoose.Model<Iuser>) ||
  mongoose.model<Iuser>("User", userSchema);
