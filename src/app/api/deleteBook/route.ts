import { dbConnect } from "@/lib/dbConnect";
import { bookModel } from "@/model/books.model";


export async function POST(req:Request){
    await dbConnect()
    try {
        const {title}=await req.json()
        const deletebook=await bookModel.findOneAndDelete({title})
        if(!deletebook){
            return Response.json({message:"Book not found of this title",success:false},{status:404})
        }
        return Response.json({message:"book deleteed",success:true},{status:200})
    } catch (error) {
        console.log("Something went wrong while deleting book",error)
        return Response.json({message:"Something went wrong while deleting book",success:false},{status:500})
    }
}