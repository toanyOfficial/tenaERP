import { getCurrentUser } from "@/modules/auth/helpers/auth";
import { unauthorizedResponse } from "@/modules/auth/helpers/errors";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return unauthorizedResponse();
  }

  return NextResponse.json({ user }, { status: 200 });
}
