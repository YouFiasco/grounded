import { NextResponse } from "next/server";

export async function GET() {
  console.log("API KEY EXISTS:", !!process.env.OPENAI_API_KEY);

  return NextResponse.json({
    ok: true,
    hasKey: !!process.env.OPENAI_API_KEY,
  });
}