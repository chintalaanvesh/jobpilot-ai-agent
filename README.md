# JobPilot - AI-Powered Job Search Automation

JobPilot is an intelligent job search platform that automates the tedious parts of job hunting. Upload your resume once, set your preferences, and let AI find, score, and create personalized application materials for relevant opportunities.

## ✨ Features

### 🎯 Smart Job Matching
- AI-powered job scoring (0-100) based on your resume
- Automated LinkedIn job search via n8n workflows
- Filter by experience level, location, job type, and work arrangement

### ✍️ Auto-Generated Application Materials
- Personalized cover letters for each job match
- Custom hiring manager email drafts
- Tailored to specific job descriptions and your background

### ⚡ Async Processing
- Background job searches - start a search and check back in minutes
- Real-time status updates
- Process multiple searches simultaneously

### 🎨 Modern UI
- Built with Next.js 14 and shadcn/ui components
- Responsive design for all devices
- Gradient themes and smooth animations

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS, Lucide Icons
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for resumes)
- **Automation**: n8n (workflow automation)
- **AI**: Claude API (via n8n)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- n8n instance (self-hosted or cloud)
- Claude API key

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/chintalaanvesh/jobpilot-ai-agent.git
cd jobpilot-ai-agent
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Run the SQL migrations in `supabase/migrations/`
   - Create a storage bucket named `resumes`

4. Configure n8n workflow:
   - Import workflow from project documentation
   - Add your Claude API credentials
   - Update webhook URLs

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
jobpilot/
├── app/                    # Next.js app directory
│   ├── actions/           # Server actions
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── login/             # Login page
│   └── signup/            # Signup page
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── auth/              # Auth forms
│   └── resume/            # Resume upload
├── lib/                   # Utilities
│   ├── supabase/          # Supabase clients
│   └── utils.ts           # Helper functions
├── supabase/              # Database migrations
└── proxy.ts               # Next.js proxy (auth middleware)
```

## 🔧 How It Works

1. **Sign Up**: Create an account and upload your resume (PDF)
2. **Configure Search**: Set job search criteria
3. **AI Processing**: n8n searches LinkedIn and Claude AI scores each job
4. **Review Results**: Get matched jobs with scores, cover letters, and email drafts
5. **Apply**: Use the generated materials to apply on LinkedIn

## 📄 License

MIT License

---

Built with ❤️ using Next.js, Supabase, and n8n
