import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, { params }: Context) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const question = await prisma.question.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!question) {
      return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
    }

    if (question.userId !== session.user.id) {
      return NextResponse.json({ error: "You can only delete your own posts" }, { status: 403 });
    }

    await prisma.question.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete discussion" },
      { status: 500 },
    );
  }
}
