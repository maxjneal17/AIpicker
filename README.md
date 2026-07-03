# AI Picker

Find the right AI tool for any task. Describe what you want to create and get a ranked recommendation from 60+ AI tools — with clear reasons why.

## Stack

- **Next.js 14** — React framework (frontend + API routes)
- **Tailwind CSS** — styling
- **Anthropic SDK** — powers the recommendation engine
- **Vercel** — deployment (free tier works great)

---

## Setup (first time)

### 1. Install Node.js
Download from https://nodejs.org — choose the LTS version.

### 2. Get your Anthropic API key
- Go to https://console.anthropic.com
- Sign up / log in
- Click "API Keys" → "Create Key"
- Copy the key (starts with `sk-ant-...`)

### 3. Clone or download this project
If you have Git: `git clone <your-repo-url>`
Or download the ZIP and unzip it.

### 4. Install dependencies
Open your terminal in the project folder and run:
```bash
npm install
```

### 5. Add your API key
Copy the example env file:
```bash
cp .env.local.example .env.local
```
Open `.env.local` and replace `your_api_key_here` with your real key.

### 6. Run it locally
```bash
npm run dev
```
Open http://localhost:3000 in your browser. That's it!

---

## Deploy to Vercel (go live)

Vercel is free and deploys in ~2 minutes.

### 1. Push your code to GitHub
- Create a free account at github.com
- Create a new repository
- Push your code to it

### 2. Connect to Vercel
- Go to https://vercel.com and sign up with GitHub
- Click "New Project" → import your GitHub repo
- Click "Deploy" — Vercel auto-detects Next.js

### 3. Add your API key to Vercel
- In your Vercel project, go to Settings → Environment Variables
- Add: `ANTHROPIC_API_KEY` = your key
- Redeploy (Settings → Deployments → Redeploy)

Your site is now live at `your-project.vercel.app` 🎉

---

## Project structure

```
ai-picker/
├── app/
│   ├── api/
│   │   └── recommend/
│   │       └── route.ts     ← Secure API route (calls Anthropic)
│   ├── globals.css          ← Global styles
│   ├── layout.tsx           ← Root layout + metadata
│   └── page.tsx             ← Main page UI
├── components/
│   └── ResultCard.tsx       ← Single recommendation card
├── lib/
│   ├── tools.ts             ← AI tools database + system prompt
│   └── types.ts             ← TypeScript types
├── .env.local.example       ← Copy to .env.local, add your key
├── package.json
└── README.md
```

## Customising the tool list

Open `lib/tools.ts` to add, remove, or update AI tools in the database. Each tool entry follows this format:
```
- Tool Name (website.com): Description of what it's good at
```

The system prompt in the same file controls how Claude reasons about recommendations.

---

## Costs

Anthropic API pricing: each recommendation costs roughly $0.001–0.003 (less than a third of a cent). You get free credits when you sign up.
