import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const saved = await prisma.savedCollege.findMany({
      where: { userId: session.user.id },
      include: { college: true },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(saved);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch saved colleges" },
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

    const { collegeId } = (await request.json()) as { collegeId?: string };

    if (!collegeId) {
      return NextResponse.json({ error: "collegeId is required" }, { status: 400 });
    }

    const existing = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId,
        },
      },
    });

    if (existing) {
      await prisma.savedCollege.delete({ where: { id: existing.id } });
      return NextResponse.json({ saved: false });
    }

    await prisma.savedCollege.create({
      data: {
        userId: session.user.id,
        collegeId,
      },
    });

    return NextResponse.json({ saved: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update saved college" },
      { status: 500 },
    );
  }
}

