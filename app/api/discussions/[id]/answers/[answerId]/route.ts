import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{ id: string; answerId: string }>;
};

export async function DELETE(_request: Request, { params }: Context) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, answerId } = await params;
    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
      select: { userId: true, questionId: true },
    });

    if (!answer || answer.questionId !== id) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }

    if (answer.userId !== session.user.id) {
      return NextResponse.json({ error: "You can only delete your own posts" }, { status: 403 });
    }

    await prisma.answer.delete({ where: { id: answerId } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete answer" },
      { status: 500 },
    );
  }
}
