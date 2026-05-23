import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: Context) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { body } = (await request.json()) as { body?: string };
    const cleanBody = body?.trim() ?? "";

    if (cleanBody.length < 10) {
      return NextResponse.json({ error: "Answer must be at least 10 characters" }, { status: 400 });
    }

    const question = await prisma.question.findUnique({ where: { id }, select: { id: true } });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const answer = await prisma.answer.create({
      data: {
        body: cleanBody,
        questionId: id,
        userId: session.user.id,
      },
    });

    return NextResponse.json(answer, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create answer" },
      { status: 500 },
    );
  }
}
