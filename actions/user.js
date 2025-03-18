"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    if (!data.industry || typeof data.industry !== "string") {
        throw new Error("Invalid industry value.");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    try {
        // Check if the industry exists
        let industryInsight = await db.industryInsight.findUnique({
            where: { industry: data.industry },
        });

        // If industry doesn't exist, create it outside the transaction to prevent timeout issues
        if (!industryInsight) {
            let insights;
            try {
                insights = await generateAIInsights(data.industry);
                console.log("Generated AI insights:", insights);
            } catch (aiError) {
                console.error("AI Insights generation failed:", aiError);
                throw new Error("Failed to generate AI insights.");
            }

            // Fix ENUM value for `demandLevel`
            const validDemandLevels = ["LOW", "MEDIUM", "HIGH"];
            if (!insights.demandLevel || !validDemandLevels.includes(insights.demandLevel.toUpperCase())) {
                console.warn(`Invalid demandLevel '${insights.demandLevel}', defaulting to 'MEDIUM'`);
                insights.demandLevel = "MEDIUM"; // Set a safe default
            } else {
                insights.demandLevel = insights.demandLevel.toUpperCase();
            }

            // Fix ENUM value for `marketOutlook`
            const validMarketOutlooks = ["POSITIVE", "NEUTRAL", "NEGATIVE"];
            if (!insights.marketOutlook || !validMarketOutlooks.includes(insights.marketOutlook.toUpperCase())) {
                console.warn(`Invalid marketOutlook '${insights.marketOutlook}', defaulting to 'NEUTRAL'`);
                insights.marketOutlook = "NEUTRAL"; // Set a safe default
            } else {
                insights.marketOutlook = insights.marketOutlook.toUpperCase();
            }

            // Create the industryInsight entry
            industryInsight = await db.industryInsight.create({
                data: {
                    industry: data.industry,
                    ...insights,
                    nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            });
        }

        // Update the user inside a transaction
        const result = await db.$transaction(
            async (tx) => {
                const updatedUser = await tx.user.update({
                    where: { id: user.id },
                    data: {
                        industry: data.industry,
                        experience: data.experience,
                        bio: data.bio,
                        skills: Array.isArray(data.skills) ? data.skills : [],
                    },
                });
                return { updatedUser };
            },
            { timeout: 15000 } // Increased timeout to 15 seconds
        );

        return { success: true, ...result, industryInsight };
    } catch (error) {
        console.error("Error updating user and industry:", {
            message: error.message,
            stack: error.stack,
        });
        throw new Error("Failed to update profile: " + error.message);
    }
}

export async function getUserOnboardingStatus() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    try {
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
            select: { industry: true }, // Select only the industry field
        });

        return {
            isOnboarded: !!user?.industry, // Returns true if industry is set, else false
        };
    } catch (error) {
        console.error("Error checking onboarding status:", {
            message: error.message,
            stack: error.stack,
        });
        throw new Error("Failed to check onboarding status.");
    }
}
