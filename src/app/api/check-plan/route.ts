import { NextResponse } from "next/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    // Use the Convex query to check if the plan exists
    const plan = await fetchQuery(api.plans.getByUserId, { userId });

    return NextResponse.json({ exists: !!plan });
  } catch (error) {
    console.error("check-plan error:", error);
    return NextResponse.json({ exists: false, error: true }, { status: 500 });
  }
}
