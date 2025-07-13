import { dbConnect } from "@/lib/dbConnect";
import { userModel } from "@/model/user.model";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { email, otp } = await req.json();

    const user = await userModel.findOne({ email });
    if (!user) {
      return Response.json(
        { message: "No user exists with this email", success: false },
        { status: 404 }
      );
    }

    const otpVerification = otp == user?.forgotPassword_otp;

    const otpExpiry = new Date(Date.now()) < user?.forgotPassword_otp_Expiry;

    if (!otpVerification) {
      return Response.json(
        { message: "You have entered a incorrect otp", success: false },
        { status: 401 }
      );
    } else if (!otpExpiry) {
      return Response.json(
        { message: "Your have entered a expired otp", success: false },
        { status: 404 }
      );
    }
     return Response.json(
        { message: "Enter otp is correct", success: true },
        { status: 200 }
      );
  } catch (error) {
    return Response.json(
      {
        message: "Something went wrong while verifying forgot password otp",
        success: false,
      },
      { status: 500 }
    );
  }
}
