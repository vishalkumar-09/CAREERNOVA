import { inngest } from "./client";
import { db } from "../prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

export const generateIndustryInsights = inngest.createFunction(
    { name: "Generate Industry Insights" },
    { cron: "0 0 * * 0" }, // Runs every Sunday at midnight
    async ({ step }) => {
        const industries = await step.run("Fetch industries", async () => {
            return await db.industryInsight.findMany({
                select: { industry: true },
            });
        });

        if (!industries || industries.length === 0) {
            console.log("No industries found.");
            return;
        }

        for (const { industry } of industries) {
            const prompt = `
            Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
            {
                "salaryRanges": [
                    { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
                ],
                "growthRate": number,
                "demandLevel": "HIGH" | "MEDIUM" | "LOW",
                "topSkills": ["skill1", "skill2"],
                "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
                "keyTrends": ["trend1", "trend2"],
                "recommendedSkills": ["skill1", "skill2"]
            }
            
            IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
            Include at least 5 common roles for salary ranges.
            Growth rate should be a percentage.
            Include at least 5 skills and trends.
            `;

            const res = await step.ai.wrap("gemini", async (p) => {
                return await model.generateContent(p);
            }, prompt);

            console.log("AI Response:", res.response);

            if (!res.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
                console.error("Invalid AI response structure", res.response);
                continue; // Skip this industry if the AI response is malformed
            }

            const text = res.response.candidates[0].content.parts[0].text.trim();
            const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

            let insights;
            try {
                insights = JSON.parse(cleanedText);
            } catch (error) {
                console.error(`Error parsing JSON for industry ${industry}:`, error);
                continue;
            }

            await step.run(`Update ${industry} insights`, async () => {
                await db.industryInsight.update({
                    where: { industry }, // 🔥 Fixed typo here
                    data: {
                        ...insights,
                        lastUpdated: new Date(),
                        demandLevel: insights.demandLevel.toUpperCase(),
                        marketOutlook: insights.marketOutlook.toUpperCase(),
                        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    },
                });
            });
        }
    }
);
