import ForgotPasswordEmail from "../../emails/forgotPasswordEmail";
import { resend } from "@/lib/resend";
export async function sendForgotPasswordmail(
  email: string,
  username: string,
  verifyCode: string
){
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "E-Library password reset code ",
      react: ForgotPasswordEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "Forgot password email sent successfully." };
  } catch (emailError) {
    console.error("Error sending  email:", emailError);
    return { success: false, message: "Failed to send  email." };
  }
}
