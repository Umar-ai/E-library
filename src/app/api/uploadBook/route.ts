import { dbConnect } from "@/lib/dbConnect";
import { bookModel } from "@/model/books.model";
import { cloudinaryUpload } from "@/helper/Cloudinary";
import { writeFile } from "fs/promises";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const data = await req.formData();
    const title = data.get("title");
    const bookFound = await bookModel.findOne({ title });
    if (bookFound) {
      return Response.json(
        { message: "Book already exits with this title", sucess: false },
        { status: 409 }
      );
    }
    const authorName = data.get("authorName");
    const language = data.get("language");
    const genre = data.get("genre");
    const bookImage = data.get("file");
    if (!(bookImage instanceof File)) {
      return Response.json(
        { message: "book image not found", sucess: false },
        { status: 404 }
      );
    }
    const fileData = await bookImage.arrayBuffer();
    const buffer = Buffer.from(fileData);
    const path = `./public/${bookImage.name}`;
    await writeFile(path, buffer);
    const cloudinaryResponse = await cloudinaryUpload(path);
    if (!cloudinaryResponse) {
      return Response.json(
        { message: "Cloudinary upload failed", sucess: false },
        { status: 500 }
      );
    }
    const imageUrl = cloudinaryResponse.url;
    const Book=await bookModel.create({
        title,
        authorName,
        genre,
        language,
        bookImage:imageUrl,
        viewCount:0,
        bookDownloadCount:0,
        reviews:[],
        reviewCount:0
    })
    if(Book){
        console.log("Book upload successfully")
         return Response.json(
        { message: "Book uploaded successfully", sucess: true},
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("Something went wrong while uploading the book", error);
    return Response.json(
      {
        message: "Something went wrong while uploading the book",
        sucess: false,
      },
      { status: 500 }
    );
  }
}
