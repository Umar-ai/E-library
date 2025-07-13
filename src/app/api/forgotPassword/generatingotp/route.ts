import { dbConnect } from "@/lib/dbConnect";
import { userModel } from "@/model/user.model";
import { sendForgotPasswordmail } from "@/helper/sendForgotPasswordemail";
export async function POST(req: Request) {
  await dbConnect();
  try {
    const { email } = await req.json();
    const user = await userModel.findOne({ email });
    if (!user) {
      return Response.json(
        { message: "No user exists with this email", success: false },
        { status: 404 }
      );
    }
    const forgotPasswordotp = Math.floor(
      10000 + Math.random() * 90000
    ).toString();
    const forgotpasswordExpiry = new Date(Date.now() + 3600000);
    user.forgotPassword_otp = forgotPasswordotp;
    user.forgotPassword_otp_Expiry = forgotpasswordExpiry;
    const updatedUser = await user.save();
    if (updatedUser) {
      await sendForgotPasswordmail(email, user.username, forgotPasswordotp);
      return Response.json(
        { message: "Forgot password otp has been set", success: true },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("Something went wrong ", error);
    return Response.json(
      {
        message:
          "Something went wrong while setting up the sendind forgot password otp",
        success: false,
      },
      { status: 500 }
    );
  }
}
