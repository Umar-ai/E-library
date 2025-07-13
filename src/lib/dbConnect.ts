import mongoose from "mongoose";

type Iconnection = {
  isConnected?: number;
};

const connection: Iconnection = {};

export const dbConnect = async () => {
  if (connection.isConnected) {
    console.log("Database is already connected");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URL || "");
    connection.isConnected = db.connections[0]?.readyState;
  } catch (error) {
    console.log("something went wrong while connecting to the database",error);
  }
};
