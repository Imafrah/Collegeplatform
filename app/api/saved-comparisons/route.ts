import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function normalizeIds(ids: string[]) {
  return [...new Set(ids.map((id) => id.trim()).filter(Boolean))].sort();
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const saved = await prisma.savedComparison.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(saved);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch saved comparisons" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { collegeIds } = (await request.json()) as { collegeIds?: string[] };
    const ids = normalizeIds(Array.isArray(collegeIds) ? collegeIds : []);

    if (ids.length < 2 || ids.length > 3) {
      return NextResponse.json({ error: "Save 2 to 3 colleges for a comparison" }, { status: 400 });
    }

    const colleges = await prisma.college.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true },
    });

    if (colleges.length !== ids.length) {
      return NextResponse.json({ error: "One or more colleges were not found" }, { status: 404 });
    }

    const key = ids.join(",");
    const existing = await prisma.savedComparison.findUnique({
      where: { userId_key: { userId: session.user.id, key } },
    });

    if (existing) {
      await prisma.savedComparison.delete({ where: { id: existing.id } });
      return NextResponse.json({ saved: false });
    }

    const title = colleges
      .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
      .map((college) => college.name)
      .join(" vs ");

    await prisma.savedComparison.create({
      data: {
        userId: session.user.id,
        title,
        key,
        collegeIds: ids,
      },
    });

    return NextResponse.json({ saved: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update saved comparison" },
      { status: 500 },
    );
  }
}
