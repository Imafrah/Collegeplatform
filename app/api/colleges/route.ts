import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const state = searchParams.get("state")?.trim();
    const type = searchParams.get("type")?.trim();
    const page = Math.max(Number(searchParams.get("page") ?? "1"), 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? "12"), 1), 50);

    const where = {
      AND: [
        q ? { name: { contains: q, mode: "insensitive" as const } } : {},
        state ? { state } : {},
        type ? { type } : {},
      ],
    };

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        orderBy: { rating: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.college.count({ where }),
    ]);

    return NextResponse.json({
      colleges,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch colleges" },
      { status: 500 },
    );
  }
}

