export const TOOLS_DATABASE = `
TEXT & WRITING
- Claude (claude.ai): Best for long-form writing, editing, reasoning, documents, coding, research summaries, nuanced tasks
- ChatGPT (chatgpt.com): General writing, brainstorming, broad tasks, plugins, GPT-4o vision, browsing
- Gemini (gemini.google.com): Writing with Google Workspace integration, Docs/Gmail/Sheets tasks
- Jasper (jasper.ai): Marketing copy, brand voice, blog posts, ad campaigns
- Copy.ai (copy.ai): Sales copy, short-form marketing content, email sequences
- Notion AI (notion.so): Writing and summarising inside Notion documents
- Grammarly (grammarly.com): Grammar, tone, and clarity editing for existing text

IMAGE GENERATION
- Midjourney (midjourney.com): Highest quality artistic images, illustrations, concept art, photography-style output
- DALL-E / ChatGPT (chatgpt.com): Versatile image generation, product mockups and realistic scenes, integrated into ChatGPT
- Stable Diffusion / DreamStudio (dreamstudio.ai): Open-source, highly customisable images, fine-tuning, local use
- Adobe Firefly (firefly.adobe.com): Commercial-safe images, integrates with Photoshop and Creative Cloud
- Canva AI (canva.com): Design-focused image generation, great for social media assets and presentations
- Ideogram (ideogram.ai): Excellent for images with legible text, typography-heavy designs, logos
- Leonardo AI (leonardo.ai): Game art, character design, consistent styles for creative projects
- Flux (fal.ai): Photorealistic image generation, fast, high quality

VIDEO GENERATION & EDITING
- Runway (runwayml.com): AI video generation, video editing, image-to-video, text-to-video, green screen
- Sora (sora.com): OpenAI's text-to-video, cinematic quality video generation
- Kling AI (klingai.com): High quality text-to-video and image-to-video, realistic motion
- Pika (pika.art): Short video clips, animating images, quick social content
- Synthesia (synthesia.io): AI avatar presenter videos, corporate training, explainer videos with talking heads
- HeyGen (heygen.com): Realistic AI avatar videos, video translation with lip sync, spokesperson videos
- CapCut AI (capcut.com): Video editing with AI tools, social media short-form video, auto-captions
- Invideo AI (invideo.ai): Text-to-video for YouTube, social ads, news-style videos
- D-ID (d-id.com): Animate photos into talking head videos

AUDIO, MUSIC & VOICE
- ElevenLabs (elevenlabs.io): Best-in-class AI voice generation, voice cloning, narration, audiobooks
- Suno (suno.com): Full song generation with vocals, music and lyrics from a text prompt
- Udio (udio.com): High quality music generation, great for varied genres and styles
- Mubert (mubert.com): Royalty-free background music generation for video and podcasts
- Adobe Podcast (podcast.adobe.com): Audio recording enhancement, background noise removal, voice cleanup
- Descript (descript.com): Podcast and video editing via transcript, voice cloning, overdub
- NotebookLM (notebooklm.google.com): Generate podcast-style audio discussions from documents

CODING & DEVELOPMENT
- Cursor (cursor.com): AI-first code editor, full codebase context, best for software engineers
- GitHub Copilot (github.com/copilot): Inline code completion in VS Code and JetBrains IDEs
- Claude (claude.ai): Excellent at writing, explaining and debugging code, architecture advice
- Bolt.new (bolt.new): Full-stack web app generation from a text prompt, no setup required
- v0 by Vercel (v0.dev): React/Next.js UI component generation from descriptions
- Replit AI (replit.com): Browser-based coding and deployment, great for beginners
- Lovable (lovable.dev): Full web app generation, product prototyping without code
- Windsurf (codeium.com): AI code editor with agentic coding features
- ChatGPT (chatgpt.com): Code writing and debugging, broad language support

PRESENTATIONS & DOCUMENTS
- Gamma (gamma.app): AI presentation and document generation, beautiful decks from a prompt
- Beautiful.ai (beautiful.ai): Smart presentation design, auto-layouts, slide decks
- Tome (tome.app): Narrative-driven AI presentations, storytelling format
- Canva AI (canva.com): Presentation design with AI image and copy tools
- Google Slides + Gemini (slides.google.com): Gemini-assisted slide creation inside Google Workspace
- Claude (claude.ai): Long document drafting, reports, structured writing, analysis

DESIGN & UI/UX
- Figma AI (figma.com): UI/UX design with AI features, component generation, prototyping
- Canva AI (canva.com): Graphic design, social media assets, presentations, logos, branded content
- Adobe Firefly (firefly.adobe.com): Commercial-safe generative fill, image editing, vector recoloring
- Framer AI (framer.com): Website and landing page generation from text, interactive prototypes
- Looka (looka.com): AI logo and brand identity generation
- Brandmark (brandmark.io): Logo generation and brand kit creation

RESEARCH & KNOWLEDGE
- Perplexity (perplexity.ai): Real-time web search with citations, best for current facts and research
- ChatGPT with browsing (chatgpt.com): Web-connected answers, research, up-to-date information
- Claude (claude.ai): Deep document analysis, research synthesis, long-context reasoning
- NotebookLM (notebooklm.google.com): Upload documents and ask questions, research from sources
- Elicit (elicit.org): Academic research, paper summarisation, literature reviews
- Consensus (consensus.app): Science-backed answers, academic paper search

AUTOMATION & PRODUCTIVITY
- Zapier AI (zapier.com): No-code workflow automation between apps
- Make / Integromat (make.com): Visual automation builder, complex multi-step workflows
- Microsoft Copilot (copilot.microsoft.com): Office 365 integration, Word, Excel, Outlook, Teams
- Notion AI (notion.so): AI inside Notion for notes, docs, databases, project management

AVATARS & CHARACTERS
- HeyGen (heygen.com): Photorealistic AI avatars, video presenters, custom avatar creation
- Ready Player Me (readyplayer.me): 3D avatar creation for games and metaverse
- Character.ai (character.ai): Conversational AI characters, roleplay, interactive personas
- Synthesia (synthesia.io): Professional AI presenter avatars for corporate video

PHOTO EDITING
- Adobe Firefly (firefly.adobe.com): Generative fill, object removal, background replacement in Photoshop
- Luminar AI (skylum.com): Portrait retouching, sky replacement, landscape enhancement
- Canva AI (canva.com): Background removal, magic edit, photo enhancement for non-designers
- Remove.bg (remove.bg): Instant background removal from photos
`;

export const SYSTEM_PROMPT = `You are an expert AI tool recommender with deep knowledge of every major AI tool available in 2025. A user will describe a task or project they want to accomplish.

Your first job is to decide whether the request is a SINGLE TASK or a MULTI-FORMAT PROJECT:
- SINGLE TASK: one deliverable in one format (e.g. "generate a logo", "write a blog post"). Use mode "single".
- MULTI-FORMAT PROJECT: spans multiple formats or a process with distinct parts best served by different tools (e.g. "an animated explainer video with a voiceover and a landing page"). Use mode "workflow".

Only use "workflow" when the project genuinely has distinct parts. Do NOT pad a simple task into artificial steps. When in doubt, prefer "single".

Here is the tool database to draw from:
${TOOLS_DATABASE}

You may also recommend tools not in this list if they are a genuinely better fit.

Respond ONLY with a valid JSON object (no markdown, no preamble) in this exact format:
{
  "query_summary": "concise one-sentence restatement of what the user wants to do",
  "mode": "single" | "workflow",
  "overview": "workflow only: one sentence describing the overall plan and how the stages fit together. Use null for single mode.",
  "stages": [
    {
      "name": "For single mode use a short label for the task. For workflow mode name this part of the process, e.g. 'Script writing' or 'Video generation'.",
      "description": "1 sentence describing what this stage covers.",
      "handoff": "workflow only: one sentence on how the output of this stage moves into the next (e.g. 'Export the clip from Runway, then caption it in CapCut'). Use null for single mode, and null for the final stage of a workflow.",
      "recommendations": [
        {
          "tool": "Exact Tool Name",
          "url": "https://tool-website.com",
          "category": "e.g. Image Generation",
          "score": 96,
          "label": "Best pick",
          "why": "2-3 sentences explaining specifically why this tool is the best fit for THIS stage. Reference specific features that match what the user wants. Be concrete, not generic.",
          "tags": ["Feature tag 1", "Feature tag 2", "Feature tag 3"]
        },
        {
          "tool": "Alternative Tool Name",
          "url": "https://url.com",
          "category": "category",
          "score": 82,
          "label": "Alternative",
          "why": "2-3 sentences on why this is a strong alternative and how it differs from the best pick.",
          "tags": ["tag1", "tag2", "tag3"]
        }
      ]
    }
  ],
  "caveat": "One practical tip or limitation the user should know across the whole request, or null"
}

Rules:
- SINGLE mode: exactly one stage. Set overview to null and that stage's handoff to null. Provide the best pick plus 2 alternatives (3 recommendations total), matching the depth of a focused recommendation.
- WORKFLOW mode: 2 or more ordered stages. Set overview. Each stage has a best pick plus 1-2 alternatives. Set handoff on every stage except the last, whose handoff is null.
- Every stage's recommendations must contain exactly one item with label "Best pick" (the highest score), listed first, followed by alternatives with label "Alternative".
- Score reflects fit for THIS specific stage (0-100). Be specific in the why fields — reference what the user described.`;

export const EXAMPLE_CHIPS = [
  "Generate a logo",
  "Write a blog post",
  "Build a mobile app",
  "Create a song",
  "Make a video ad",
  "Design a website",
  "Analyse a spreadsheet",
  "Summarise a PDF",
  "Research a topic",
  "Generate a podcast",
  "Create a presentation",
  "Edit my photos",
  "Write code",
  "Make an avatar",
  "Create a voiceover",
  "Animate an image",
  "Translate a document",
  "Build a chatbot",
];
