import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const GET = async (request) => {
  try {
    await connectToDatabase();

    const prompts = await Prompt.find({}).populate("creator");

    //To dynamically get the path
    const path = request.nextUrl.searchParams.get("path") || "/";

    revalidatePath(path);

    return NextResponse.json(prompts);
  } catch (error) {
    return new Response("Failed to fetch all prompts", { status: 500 });
  }
};
