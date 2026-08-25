# 💸 Welth - One Stop Finance Platform

Welth is a modern, AI-powered financial management platform designed to help you take control of your finances. Manage your money smarter with beautiful visualizations, automated tracking, and intelligent AI insights.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-316192?style=for-the-badge&logo=postgresql)

## ✨ Features

- **🔒 Secure Authentication:** Powered by [Clerk](https://clerk.com/) for seamless sign-ups and logins.
- **🤖 AI Insights:** Integrated with Google Generative AI to provide smart financial suggestions and analysis.
- **📊 Beautiful Visualizations:** Interactive charts and graphs powered by Recharts.
- **⚙️ Background Jobs:** Reliable background processing and cron jobs handled by [Inngest](https://www.inngest.com/).
- **📧 Email Notifications:** Beautiful automated emails using Resend and React Email.
- **🛡️ Bot Protection:** Secured by Arcjet.
- **🎨 Modern UI:** Fully responsive and accessible interface built with Tailwind CSS and Shadcn UI.

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router) & React 19
- **Styling:** Tailwind CSS v4, Shadcn UI, Framer Motion
- **Database & ORM:** PostgreSQL, Prisma
- **Authentication:** Clerk
- **AI Integration:** Google Generative AI (Gemini)
- **Background Jobs:** Inngest
- **Emails:** Resend, React Email
- **Forms & Validation:** React Hook Form, Zod

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Shivamku19/Welth.git
cd Welth
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add the following required keys:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/welth"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"

# AI Integration
GEMINI_API_KEY="your_google_gemini_key"

# Resend Emails
RESEND_API_KEY="your_resend_api_key"

# Arcjet Security
ARCJET_KEY="your_arcjet_key"
```

### 4. Setup the Database

Generate Prisma client and push the schema to your database:

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## 👨‍💻 Author

Made with 💗 by **Shivam** ([@Shivamku19](https://github.com/Shivamku19))
