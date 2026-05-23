import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.getAll("ids").filter(Boolean);

    if (ids.length < 2 || ids.length > 3) {
      return NextResponse.json(
        { error: "Select 2 to 3 colleges to compare" },
        { status: 400 },
      );
    }

    const colleges = await prisma.college.findMany({
      where: { id: { in: ids } },
    });

    const ordered = ids
      .map((id) => colleges.find((college) => college.id === id))
      .filter(Boolean);

    return NextResponse.json(ordered);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to compare colleges" },
      { status: 500 },
    );
  }
}

