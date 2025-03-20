"use server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});
export async function generateQuiz() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");
  try {
    const prompt = `
    Generate 10 technical interview questions for a ${
      user.industry
    } professional${
      user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
    }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    const quiz = JSON.parse(cleanedText);
    return quiz.questions;
  } catch (error) {
    console.error("Error genersting quiz:", error);
    throw new Error("Failed to generate quiz questions");
  }
}

export async function saveQuizResult(questions, answer, score) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");
  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers(index),
    isCorrect: q.correctAnswer === answer(index),
    explaination: q.explaination,
  }));

  const wrongAnswer = questionResults.filter((q) => !q.isCorrect);
  let improvementTip = null;
  if (wrongAnswer.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer:"${q.answer}"\nUser Answer: ${q.userAnswer}"`
      )
      .join("\n\n");
    const improvementPrompt = `
    The user got the following ${user.industry} technical interview question wrong: ${wrongQuestionsText}
    Based on these mistakes,provide a concise ,specific improvement tip.
    Focus on the knowledge gaps revealed by these wrong answer.
    Keep the respose under 2 sentences and make it encouraging .
    Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    
    `;
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      improvementTip = response.text().trim();
    } catch (error) {
        console.error("Error generative improvement tip:",error);
    }
  }
  try {
    const assessment = await db.assessment.create({
        data:{
            userId: user.id,
            quizScore:score,
            questions:questionResults,
            category : "Technical",
            improvementTip,
        },
    });
    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:",error);
    throw new Error("Failed to save quiz result");
  }
}
