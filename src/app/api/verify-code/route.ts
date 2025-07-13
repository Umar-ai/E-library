import { dbConnect } from "@/lib/dbConnect";
import { userModel } from "@/model/user.model";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const {username,otp} = await req.json();
    const user = await userModel.findOne({ username });
    if (!user) {
      return Response.json(
        { success: false, message: "No use exists with this username " },
        { status: 404 }
      );
    }
    if(!(user.verfiyCode==otp)){
        return Response.json({success:false,message:"verification code is not correct"},{status:401})
    }
    const presentTime=new Date(Date.now())
    if(presentTime>user.verifyCodeExpiry){
        return Response.json({success:false,message:"verification code is expired"},{status:400})
    }

    user.isVerified=true;
    await user.save()
    console.log("User verified")
    return Response.json({message:"User has been verified",success:true},{status:200})

  } catch (error) {
    console.log("Something went wrong while verifying the code", error);
    return Response.json(
      { success: false, message: "something went wrong while signing up " },
      { status: 500 }
    );
  }
}
