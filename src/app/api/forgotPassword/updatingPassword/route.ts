import { dbConnect } from "@/lib/dbConnect";
import { userModel } from "@/model/user.model";
import bcrypt from "bcryptjs";
export async function POST(req: Request) {
  await dbConnect();
  try {
    const { email,updatedPassword } = await req.json();
    const user = await userModel.findOne({ email });
    if (!user) {
      return Response.json(
        { message: "No user exists with this email", success: false },
        { status: 404 }
      );
    }
    const hashedPassword=await bcrypt.hash(updatedPassword,10)
    user.password=hashedPassword
    await user.save()
    return Response.json(
      {
        message:
          "User password updated successfully",
        success: true
      },
      { status: 200 }
    );

  } catch (error) {
    console.log("Something went wrong while updating password ", error);
    return Response.json(
      {
        message:
          "Something went wrong while updating password",
        success: false
      },
      { status: 500 }
    );
  }
}
