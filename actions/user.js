"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function updateUser(data) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
    });

    if (!user) throw new Error("User not found");

    try {
        // Check if the industry exists
        let industryInsight = await db.industryInsight.findUnique({
            where: { industry: data.industry },
        });

        // If industry doesn't exist, create it outside the transaction to prevent timeout issues
        if (!industryInsight) {
            industryInsight = await db.industryInsight.create({
                data: {
                    industry: data.industry,
                    salaryRanges: [], // Default empty array
                    growthRate: 0, // Default value
                    demandLevel: "MEDIUM", // Default value
                    topSkills: [], // Default empty array
                    marketOutlook: "NEUTRAL", // Default value
                    keyTrends: [], // Default empty array
                    recommendedSkills: [], // Default empty array
                    nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
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
            { timeout: 5000 } // Increased timeout to 5 seconds
        );

        return { success: true, ...result, industryInsight };
    } catch (error) {
        console.error("Error updating user and industry:", error.message);
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
        console.error("Error checking onboarding status:", error.message);
        throw new Error("Failed to check onboarding status.");
    }
}
