import { NextResponse } from "next/server";
import { getCurrentUser } from "@/modules/auth/helpers/auth";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ user }, { status: 200 });
}
