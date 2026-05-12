# NexHire - AI-Driven Job Search Platform (Client)

NexHire is a production-ready, AI-powered full-stack job board platform designed to bridge the gap between talent and opportunities using cutting-edge Generative AI.

## 🚀 Live Demo
- **Frontend**: [https://nexhire-client.vercel.app](https://nexhire-client.vercel.app)
- **Backend**: [https://nexhire-server.render.com](https://nexhire-server.render.com)

## ✨ AI Features
NexHire integrates 4 powerful AI features using Google's Gemini Pro:
1. **AI Resume Analyzer**: Provides an ATS score, strengths, weaknesses, and actionable suggestions for improvement.
2. **AI Cover Letter Generator**: Generates tailored, professional cover letters based on job descriptions and user profiles.
3. **AI Job Matcher**: Analyzes user skills and preferences to recommend the most relevant active job openings with match scores.
4. **AI Interview Coach**: A context-aware chatbot that helps candidates practice mock interviews and behavioral questions.

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + ShadCN UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod
- **Authentication**: Better Auth (with Google & Email/Password)
- **Animations**: Framer Motion

## 📦 Features
- **Landing Page**: 8+ sections including Hero, Features, Stats, Testimonials, FAQ, and more.
- **Explore Jobs**: Advanced filtering (category, location, type), debounced search, and pagination.
- **Role-Based Dashboards**:
  - **Seeker**: Profile management, application tracking, saved jobs, AI tools.
  - **Employer**: Job posting, applicant management, company profile.
  - **Admin**: User & job management, platform analytics.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop.
- **Light/Dark Mode**: Seamless theme switching with proper contrast.

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation
1. Clone the repository
2. Navigate to the client directory:
   ```bash
   cd client
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## 📄 License
ISC
