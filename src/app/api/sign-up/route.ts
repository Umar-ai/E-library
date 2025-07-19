import { dbConnect } from "@/lib/dbConnect";
import { userModel } from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import { cloudinaryUpload } from "@/helper/Cloudinary";
import { sendVerificationEmail } from "@/helper/sendVerificationEmali";
import { writeFile} from "fs/promises";
import { File } from "buffer";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  //check user already existed or not
  //use multer to put the image in the req
  //usecloudinary to upload the pictures
  //create the user

  await dbConnect();
  try {
    const data = await req.formData();
    const username = data.get("username");
    const email = data.get("email");
    const password = data.get("password");
    const isExisted = await userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (isExisted) {
      return Response.json(
        { success: false, message: "user already with these credentials" },
        { status: 409 }
      );
    }
    const file = data.get("file");

    if (!(file instanceof File)) {
      return new Response("Expected a file upload", { status: 400 });
    }
    if (!file) {
      return Response.json(
        {
          success: false,
          message: "File not found avatar is required to proceed further",
        },
        { status: 404 }
      );
    }
    const filedata = await file.arrayBuffer();
    const buffer = Buffer.from(filedata);
    const path = `./public/${file.name}`;
    await writeFile(path, buffer);
    const cloudinary_Upload = await cloudinaryUpload(path);
    if (!cloudinary_Upload) {
      console.log("Upload to the cloudinary failed");
      return Response.json(
        { message: "Cloudinary upload failed", sucess: false },
        { status: 502 }
      );
    }
    let hashPassword;
    if (typeof password == "number") {
      hashPassword = bcrypt.hash(password, 10);
    }
    const verification_code = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationCodeExpiry = new Date(Date.now() + 3600000);
    const image_url = cloudinary_Upload.url;
    console.log(cloudinary_Upload)
    const user = await userModel.create({
      username,
      email,
      password: hashPassword,
      avatar: image_url,
      isVerified: false,
      isAdmin: false,
      isPremiumMember: false,
      downloadCount: 0,
      verfiyCode: verification_code,
      verifyCodeExpiry: verificationCodeExpiry,
      MemberType: "basic",
      progress: [],
    });
    if(user){
      if(typeof email =="string"&&typeof username=="string")
      await sendVerificationEmail(email,username,verification_code)
      return Response.json(
        { message: "User created successfully", sucess: true },
        { status: 200 }
      );

    }

  } catch (error) {
    console.log("something went wrong while signingup", error);
    return Response.json(
      { success: false, message: "something went wrong while signing up " },
      { status: 500 }
    );
  }
}
