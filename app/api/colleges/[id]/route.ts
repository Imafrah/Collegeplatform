import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const college = await prisma.college.findUnique({ where: { id } });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    return NextResponse.json(college);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch college" },
      { status: 500 },
    );
  }
}

