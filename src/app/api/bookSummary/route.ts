import { ai } from "@/lib/gemini";

export async function POST(req: Request) {
  const data = await req.json();
  if (!data.bookName) {
    return Response.json({
      success: false,
      message: "Book name is required for this action",
    });
  }
  const prompt = `Generate a detailed summary of the book ${data.bookName} consisting of 100 words the summary should be covering from starting to the conclusin and avoid putting unimportant content such as when the book is published or who wrote it`;
  const response = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  for await(const chunks of response){

      console.log(chunks.text);
  }
  return Response.json({ success: false });
}
