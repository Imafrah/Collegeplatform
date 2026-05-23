import Link from "next/link";
import { notFound } from "next/navigation";
import AnswerForm from "@/components/AnswerForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DiscussionDetailPage({ params }: Props) {
  const { id } = await params;
  const question = await prisma.question.findUnique({
    where: { id },
    include: {
      user: { select: { name: true } },
      answers: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!question) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/discussions" className="text-sm font-medium text-blue-600 hover:text-blue-700">
        Back to discussions
      </Link>

      <article className="mt-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">{question.title}</h1>
        <p className="mt-2 text-sm text-slate-500">
          Asked by {question.user.name ?? "Student"} on {question.createdAt.toLocaleDateString("en-IN")}
        </p>
        <p className="mt-5 whitespace-pre-line leading-7 text-slate-700">{question.body}</p>
      </article>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-slate-900">Answers</h2>
        {question.answers.length ? (
          <div className="mt-4 space-y-3">
            {question.answers.map((answer) => (
              <article key={answer.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="whitespace-pre-line leading-7 text-slate-700">{answer.body}</p>
                <p className="mt-4 text-xs text-slate-500">
                  Answered by {answer.user.name ?? "Student"} on {answer.createdAt.toLocaleDateString("en-IN")}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-3 rounded-xl border border-slate-200 bg-white p-5 text-slate-600 shadow-sm">
            No answers yet. Be the first to respond.
          </p>
        )}
      </section>

      <div className="mt-6">
        <AnswerForm questionId={question.id} />
      </div>
    </div>
  );
}
