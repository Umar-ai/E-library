import mongoose, { Schema } from "mongoose";

export interface Ireveiw extends Document {
  username: string;
  review: string;
}
export interface Ibook extends Document {
  title: string;
  authorName: string;
  genre: string;
  bookImage: string;
  language:string;
  viewCount: number;
  bookDownloadCount: number;
  reviewCount: number;
  reviews: Ireveiw[];
}

export const bookSchema: Schema<Ibook> = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  bookImage: {
    type: String,
    required: true,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  bookDownloadCount: {
    type: Number,
    default: 0,
  },
  language:{
    type:String,
    required:true
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      username: { type: Schema.Types.ObjectId, ref: "User" },
      reviewmsg: { type: String },
    },
  ],
});

export const books =
  (mongoose.models.Book as mongoose.Model<Ibook>) ||
  mongoose.model<Ibook>("Book", bookSchema);
