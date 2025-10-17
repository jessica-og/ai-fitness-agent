import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";


const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📩 Vapi webhook received:", body);

    const userId =
      body?.data?.variables?.user_id ||
      body?.data?.variableValues?.user_id ||
      body?.user_id;

    if (!userId) {
      console.error("❌ Missing user_id in webhook");
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    // Avoid duplicates
    const existing = await convex.query(api.plans.getByUserId, { userId });
    if (existing) {
      console.log("✅ Plan already exists for this user");
      return NextResponse.json({ success: true });
    }

    // Dummy data (replace later if Vapi sends real plan data)
    await convex.mutation(api.plans.createPlan, {
      userId,
      name: "AI Generated Plan",
      workoutPlan: {
        schedule: ["Monday"],
        exercises: [
          {
            day: "Monday",
            routines: [
              { name: "Push-ups", sets: 3, reps: 12 },
              { name: "Squats", sets: 3, reps: 15 },
            ],
          },
        ],
      },
      dietPlan: {
        dailyCalories: 2000,
        meals: [
          { name: "Breakfast", foods: ["Oatmeal", "Banana"] },
          { name: "Lunch", foods: ["Chicken", "Rice"] },
        ],
      },
      isActive: true,
    });

    console.log("✅ Plan created for user:", userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error in webhook:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}