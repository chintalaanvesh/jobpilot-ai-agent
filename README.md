# JobPilot — AI-Powered Job Search Agent

> Upload your resume once. JobPilot discovers relevant jobs, scores each one against your profile, and generates personalized cover letters and outreach emails — fully automated.

[![Live Demo](https://img.shields.io/badge/Live_Demo-jobpilot--ai--agent.vercel.app-000000?logo=vercel&logoColor=white&style=flat-square)](https://jobpilot-ai-agent.vercel.app)
![Next.js](https://img.shields.io/badge/Next.js_14-000000?logo=nextdotjs&logoColor=white&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white&style=flat-square)
![Claude API](https://img.shields.io/badge/Claude_API-CC785C?logo=anthropic&logoColor=white&style=flat-square)
![n8n](https://img.shields.io/badge/n8n-EA4B71?logo=n8n&logoColor=white&style=flat-square)

---

## What It Does

| Stage | Description |
|-------|-------------|
| **Discover** | n8n workflow searches LinkedIn for jobs matching your criteria |
| **Score** | Claude AI reads your resume and the job description, outputs a fit score (0–100) with reasoning |
| **Generate** | Produces a personalized cover letter and a hiring manager email draft for each match |
| **Deliver** | Results surface in your dashboard with all materials ready to use |

Searches run asynchronously in the background — start a search, check back in minutes.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL) |
| Auth & Storage | Supabase Auth + Supabase Storage |
| Automation | n8n |
| AI | Claude API (via n8n) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- n8n instance (self-hosted or cloud)
- Claude API key

### Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Installation

```bash
git clone https://github.com/chintalaanvesh/jobpilot-ai-agent.git
cd jobpilot-ai-agent
npm install
```

1. Run the SQL migrations in `supabase/migrations/`
2. Create a Supabase storage bucket named `resumes`
3. Import the n8n workflow, add your Claude API credentials, and update the webhook URLs
4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production

```bash
npm run build
npm start
```

---

## Project Structure

```
jobpilot/
├── app/
│   ├── actions/        # Server actions
│   ├── api/            # API routes
│   ├── dashboard/      # Dashboard pages
│   ├── login/
│   └── signup/
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── auth/           # Auth forms
│   └── resume/         # Resume upload
├── lib/
│   ├── supabase/       # Supabase clients
│   └── utils.ts
├── supabase/
│   └── migrations/     # Database schema
└── proxy.ts            # Auth middleware
```

---

## How It Works

1. **Sign Up** — create an account and upload your resume (PDF)
2. **Configure** — set job title, location, experience level, and work arrangement preferences
3. **Search** — n8n searches LinkedIn; Claude scores each result against your resume
4. **Review** — browse matched jobs with fit scores, cover letters, and email drafts
5. **Apply** — copy the generated materials and apply directly on LinkedIn

---

## License

MIT License. See [LICENSE](LICENSE) for details.
