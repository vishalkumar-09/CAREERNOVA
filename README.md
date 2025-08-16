CAREERNOVA-A Career Coach Platform
A Full Stack AI-powered Career Coach application built with React 19, Next.js 15, Tailwind CSS, Gemini AI, Prisma, NeonDB, Clerk authentication, Inngest, and Shadcn UI.

🔥 Features
Modern Landing Page:

Professional design with scroll animation, feature showcase, user testimonials, FAQ, and statistics.

Fully responsive and dark-mode enabled using Shadcn UI and Tailwind CSS.

User Authentication & Onboarding:

Clerk-powered authentication (Google/email).

User profile setup: industry, occupation, experience, skills, professional bio.

Interactive Career Dashboard:

Industry Insights: Weekly-updated dashboard displaying in-demand skills, market growth, salary trends, and recommended skills for selected industries.

Background cron jobs (Inngest) to update trends automatically.

AI Resume Builder:

Build ATS-optimized resumes directly within the app.

AI-powered content generation for work experience, based on Gemini AI.

Download Markdown-formatted resumes as PDFs.

Store and edit resumes; data is persisted in PostgreSQL (NeonDB).

Mock Interview Preparation:

Role-based mock interviews: Gemini AI generates tailored questions.

Performance tracking, improvement tips, answer explanations.

Quiz history, stats, and visualizations via Recharts.

AI Cover Letter Generator:

Auto-generate cover letters tailored to job descriptions and user details.

Editable, downloadable, and stored in your profile.

User Management:

Manage and update user profile, authentication sessions, account security features.

Growth Tools Dropdown:

Quick access to Resume Builder, Cover Letter Generator, Interview Prep, and more.

🧑💻 Tech Stack
Frontend: React 19, Next.js 15, Tailwind CSS, Shadcn UI.

Authentication: Clerk.

Database: NeonDB (PostgreSQL), Prisma ORM.

AI Integration: Gemini AI API.

Background Tasks: Inngest.

Charts: Recharts.

Forms & Validation: React Hook Form, Zod.

🚀 Getting Started
Clone the repo & install dependencies:

bash
git clone https://github.com/piyush-eon/ai-career-coach.git
cd ai-career-coach
npm install
Add environment variables: .env file for database, Clerk, Gemini AI, Inngest, etc.

Run development server:

bash
npm run dev
Visit http://localhost:3000 to start using CAREERNOVA.

🛠️ Notable Implementations
Shadcn UI pre-built/components for a scalable and customizable design.

Dark Mode theme support.

Protected Routes: Middleware for access control/guards.

Custom Sign-in/Sign-up pages: Seamless integration with Clerk.

Background Cron Jobs: Weekly tasks for updating industry insights using Inngest.
