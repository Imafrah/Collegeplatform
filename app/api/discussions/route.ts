import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      include: {
        user: { select: { name: true, image: true } },
        _count: { select: { answers: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch discussions" },
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

    const { title, body } = (await request.json()) as { title?: string; body?: string };
    const cleanTitle = title?.trim() ?? "";
    const cleanBody = body?.trim() ?? "";

    if (cleanTitle.length < 8) {
      return NextResponse.json({ error: "Title must be at least 8 characters" }, { status: 400 });
    }

    if (cleanBody.length < 10) {
      return NextResponse.json({ error: "Question details must be at least 10 characters" }, { status: 400 });
    }

    const question = await prisma.question.create({
      data: {
        title: cleanTitle,
        body: cleanBody,
        userId: session.user.id,
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create question" },
      { status: 500 },
    );
  }
}
