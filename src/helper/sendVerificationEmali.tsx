import VerificationEmail from "../../emails/verificationEmail";
import { resend } from "@/lib/resend";
export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
){
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Mystery Message Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
      scheduledAt:"in 5 min"
    });
    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email." };
  }
}
