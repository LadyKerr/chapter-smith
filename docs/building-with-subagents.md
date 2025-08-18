---
title: "Claude Chapter Smith: Building a YouTube Chapter Generator with Subagents"
description: "How I built a YouTube chapter generator with Claude’s agentic workflows — complete with real prompts, docs, and demos."
icon: "5"
pubDate: "2025-08-17"
heroImage: "/src/assets/youtube_chapters.png"
tags: ["ai", "coding", "tutorial", "agents", "projects"]
---

# Claude Chapter Smith 🎬  
*Turn any YouTube URL into timestamped chapters. Built with Claude subagents.*

I wanted to solve a simple but frustrating problem:  
Generating Chapters for Youtube videos takes hours. I've had to do it multiple times, and it's always been a tedious process.

So, instead of making timestamps manually, I decided to **build a YouTube Chapter Generator app** — and I let **Claude’s subagents** do the heavy lifting.  

This post walks through:  
- How I set up the project + subagents!  
- The *exact prompts* I used at every stage  
- The wins (and mistakes) along the way  
- Screenshots + output docs from each phase  

Let’s dive in 👇🏽

---

## 🏗️ Step 1: Setting Up the Project

I kicked things off by asking Claude for a structured agentic workflow:

```
I need you to help me build an web app using specialized AI agents in a structured workflow.

## Context:
I have a repository of AI agents that can work together. Here's the agent data:
https://github.com/contains-studio/agents/tree/main

## How Agent Workflows Work:
Agents collaborate using this syntax:
> First use the [agent-name] to [task], then use the [agent-name] to [next task]

. . .
```

> See the full prompt here: [Agent Workflow Prompt](https://gist.github.com/LadyKerr/18f5f39c0659f7ce037660da49baccf4)


This helped in scaffolding the project manually, so Claude had a solid foundation. I created:

- New **Next.js app with TypeScript + Tailwind CSS**  
- `Claude.md` with project details  
- Pulled in **subagents** from [Contains Studio’s agent repo](https://github.com/contains-studio/agents/tree/main)  
- Retrieved and saved my **YouTube + Anthropic API keys** in `.env`  
- Installed **Playwright + MCP server** for orchestration
- Created `agent-workspace` directory for agent files and handoffs

This took about an hour, but it paid off — Claude worked best when it had a clear structure to build on.

---

## 🧠 Phase 1: Planning

Here’s the **first planning prompt** I ran:

```txt
CONTEXT: Read .agent-workspace/context/* files for project scope and constraints.

TASK: Research and plan UX for YouTube chapters generator app with these EXACT features:
1. URL input form
2. Transcript retrieval status
3. .srt upload fallback
4. Chapter list display
5. Copy/export controls
6. Error states

REQUIREMENTS:
- Focus on user flow optimization
- Plan for mobile responsiveness
- Design error handling UX
- Consider loading states
- Plan micro-interactions

SAVE OUTPUT TO: .agent-workspace/outputs/ux-research.md

INCLUDE:
- User journey mapping
- Wireframe descriptions
- Interaction patterns
- Accessibility considerations
- Mobile-first approach
```
Claude invoked the `ux-researcher` agent who provided a `UX research doc` that mapped out:
    - User journeys (from input → transcript → chapters → export)
    - Accessibility notes (like keyboard shortcuts + screen reader states)
    - Loading/error states

Next, I ran the `sprint planning` prompt:

```txt
CONTEXT: Read .agent-workspace/outputs/ux-research.md and .agent-workspace/context/*

TASK: Prioritize development tasks and create sprint plan for remaining phases.

REQUIREMENTS:
- Break down UX research into actionable tasks
- Prioritize by technical complexity
- Ensure 6-day sprint feasibility
- Plan handoffs between phases

SAVE OUTPUT TO: .agent-workspace/handoffs/phase1-to-phase2.md

INCLUDE:
- Task prioritization
- Technical requirements
- Design specifications needed
- Development sequence
```
Claude intuitively knew to trigger the `sprint-prioritizer` agent to get this step completed. 

![Sprint Planning Agent](/docs/images/sprint-prioritizer.png)

The output? A handoff doc with task breakdowns and sequencing. Honestly, it looked like something a real PM would put together before a sprint.

![Phase 1 to Phase 2 Handoff](/docs/images/phase1-handoff-doc.png)


✅ Phase 1 complete.

## 🎨 Phase 2: Designing

I wanted actual UI specs (not code yet), so I prompted:

```txt
CONTEXT: Read .agent-workspace/outputs/ux-research.md and .agent-workspace/handoffs/phase1-to-phase2.md

TASK: Design UI components for YouTube chapters generator following the UX specifications.

EXACT COMPONENTS TO DESIGN:
1. URL input form with validation states
2. Loading spinner for transcript fetch
3. .srt upload dropzone
4. Chapter list with timestamps
5. Copy button with feedback
6. Export button with download state
7. Error message components
8. Mobile responsive layouts

REQUIREMENTS:
- Use Tailwind CSS classes only
- Design for Next.js components
- Include hover/focus states
- Mobile-first responsive design
- Clean, modern aesthetic

SAVE OUTPUT TO: .agent-workspace/outputs/ui-designs.md

INCLUDE:
- Component specifications
- Tailwind class definitions
- Responsive breakpoints
- Color scheme
- Typography scale

```

As you can see, the prompts follow the same pattern - Context, Task, Requirements, Save Output, Include. This consistency helps ensure that all aspects of the project are covered and that the output is well-structured and organized.

I expected a full UI design that can be implemented by the frontend engineer agent and be used by the whimsy-injector agent to add flair and good user experience.
I liked that claude immediately read the handoff documents and the ux research before creating its todo list. This ensures that all the context from the previous phase is passed down to this next phase of development.

But, I noticed that Claude did not invoke the ui-designer agent automatically.
When I checked the `description` field in the agent’s file, there was  no “use PROACTIVELY” or “MUST BE USED” in the field. The first two agents did not have this either but they were invoked as needed.

The output was also not what was expected. Claude provided sample code, which is not what I was expecting at all, so I cleared the context window, deleted the `ui-design.md` plan and reran the prompt, explicitly asking claude to use the specialized the `ui-designer` agent:

```
Use the ui-designer agent to complete the following:
[same prompt as above]
```

![UI Design Agent](/docs/images/ui-designer-agent.png)
Invocation successful.

While Claude was working on that, I updated the other agents to include specific language so they can be invoked as needed. We recommend that you include phrases like “use PROACTIVELY” or “MUST BE USED” in your description field, to encourage more proactive subagent usage by Claude.


Once the task was complete, the ui-designer used a surprising 79,800 tokens! This surprised me as it used a lot more than the ux-researcher agent during the planning phase. It provided:
    - Typography scale + Tailwind class references
    - Button, input, error, loading components
    - Color palette + responsive breakpoints

The detail of the design specifications was impressive. It included not only the visual aspects but also the behavior of each component. It gave me the idea to use this doc to create a storybook design system, but that is a project for another day.

Now that we have our ui-design file, I now wanted delight ✨. So, I added whimsy, with the `whimsy-injector` agent:

```txt
Use the whimsy injector agent to complete the following:
CONTEXT: Read .agent-workspace/outputs/ui-designs.md

TASK: Add micro-interactions and delightful touches to the UI designs.

FOCUS AREAS:
- URL input animation
- Loading state personality
- Success feedback animations
- Copy button micro-interaction
- Export progress indication

REQUIREMENTS:
- Keep interactions subtle
- Ensure accessibility
- Use CSS/Tailwind animations only
- Maintain performance

SAVE OUTPUT TO: .agent-workspace/handoffs/phase2-to-phase3.md

INCLUDE:
- Animation specifications
- Interaction triggers
- Performance considerations
- Implementation notes for developers

```
The result? UI specs with personality.✨
Think animated loaders, success toasts, and smooth copy button states.

## 💻 Phase 3: Frontend Development

I'm ready to start developing but have unfortunately hit usage limits. The past 2 hours were spent planning and designing with subagents and it’s proved quite useful! I 100% know that the frontend and backend will be incredibly resilient because of this.

Once 5pm hit, my usage limits were refreshed, and I was able to have Claude continue the previous session. The frontend-developer agent built the initial UI and created a frontend specs doc for the other agents to reference.

On initial load, there was a syntax error, so I asked Claude to resolve it:

```txt
please resolve this error [Error: Failed to load chunk
  server/chunks/ssr/[root-of-the-server]__38b1595c._.js from parent module
  [project]/node_modules/next/dist/esm/build/templates/app-page.js?page=/page { GLOBAL_ERROR_MODULE =>
  "[project]/node_modules/next/dist/client/components/builtin/global-error.js [app-rsc] (ecmas . . .)
```

Claude was able to resolve the issue pretty quickly: I had CSS in JS tags — which isn’t compatible with Next.js App Router.
It removed those instances across all components.

Once resolved, here is the initial output from that work:
![Chapter Smith Initial UI](/docs/images//chapter-smith-init-ui.png)

The UI felt polished and professional and had beautiful animated elements that immediately pulled me in as a user. I think all my planning and agent whimsy attention to detail paid off so far in terms of design.
The very first build felt professional and honestly production ready (from a UI perspective).

This really showcases how imperative planning is when building applications. All that time spent researching and detailing ui specs really made a difference here. I only had one debugging session, which claude was able to resolve in no time and now I can move on to implementing the api with the backend architect agent.

The next step in phase 3 is really to implement tests with the testing agent, but to get the application fully functional, let’s do the apis first THEN implement testing (jic I run out of tokens again 😀). 

## 🔌 Phase 3.5: Backend Development

Prompt for backend setup:

```txt
CONTEXT: Read .agent-workspace/handoffs/phase3-to-phase4.md and examine frontend components

TASK: Build Next.js API routes for YouTube chapters functionality.

EXACT ENDPOINTS TO BUILD:
1. /api/youtube/transcript - Fetch YouTube transcript
2. /api/chapters/generate - Generate chapters from transcript
3. /api/chapters/export - Format chapters for download

REQUIREMENTS:
- YouTube Data API v3 integration
- Error handling for all edge cases
- TypeScript interfaces
- Input validation
- Rate limiting considerations

SAVE FILES TO:
- src/app/api/youtube/
- src/app/api/chapters/
- src/app/types/api.ts

SAVE SPECS TO: .agent-workspace/outputs/backend-specs.md

INCLUDE:
- API documentation
- Error codes
- Environment variables needed
- Integration instructions
```

Claude delivered:
- /api/youtube/transcript
- /api/upload/srt
- /api/generate
 - /api/export

With docs that felt enterprise-ready 💃🏼

![Backend architect](/docs/images//backend-architect.png)

I had to test and debug each route but building in this manner was a lot faster than Im used to! I cant believe in 3 hours, I have a fully functioning app, ready to be deployed. Agentic development with claude is incredible and Im highly impressed!! I love that Claude chose to use the youtube-transcript library to fetch transcripts, that’s the exact approach I would've taken - no sense reinventing the wheel when we have open source tools! Wow, I can't wait to share this with my dev community!

## 🐛 Debugging & Prompts that Helped

Issue: could not fetch transcripts for videos.
Prompt:
```txt
when testing the /api/youtube/transcript route, I receive an error and no transcript is returned. 
The youtube api is valid and Youtube Data api v3 is enabled. 
Think about why this could be happening and implement a fix
```

Resolution:
![Double URL issue fix](/docs/images/resolve-issue1.png)

Issue: URL pasted twice in input field
Prompt:
```txt
when testing the /api/youtube/transcript route, I receive an error and no transcript is returned. 
The youtube api is valid and Youtube Data api v3 is enabled. 
Think about why this could be happening and implement a fix
```

Resolution:
Telling Claude to “think” really makes a difference in its approach to problem solving. 
![Youtube API issue](/docs/images/resolve-issue-2.png)

The responses seem more thoughtful, methodical and intentional. Just like I would be doing if I was debugging this issue.

As we all know, implementing apis can be a huge time sunk so I was so happy to have claude by my side. I still; ended up sinking time into debugging and testing the apis, but I know that this time would have been much longer if I had to build the apis from scratch.

This is where having tests implemented would've come in handy - I was trying to be hasty due to time constraints BUT I probably would've saved myself an hour if I implemented tests as I go (TDD anyone?).

I was ready to use the `ai-engineer` agent to implement the final build processes and get everything working together, but I ran out of tokens again. So, I will have to continue this at 10pm. It has been a total of 4 hours, so I will use some time to create detailed Readme and write up this blog post.

The hardest part of this process was waiting for my limits to be refreshed. I reached the limits so quickly, and did not upgrade to the $100/month plan, though I REALLY wanted to. However, my Pro plan has been good to me, so I decided to wait instead - this definitely prolonged the project building phases.

I'm pretty determined to get the app working and deployed, so I will continue this at 10pm when my limits refresh again.

🎥 The Demo

Here’s the first working build in action:

[[insert gif]]

## 📝 Lessons Learned

- Context window size matters → Detailed planning docs made later phases smooth.
- Agent descriptions matter → Add “MUST BE USED” so Claude doesn’t skip critical agents.
- Debugging prompts should include “think” → More thoughtful fixes.
- Usage limits slowed me down → Pro plan resets stretched the project time.
- Tests should’ve come earlier → Would’ve saved debugging hours.
- UI design is crucial → Early focus on UX paid off in frontend polish.
- Choose a simpler MVP → The YouTube API integration was more complex than expected.

## 🚀 Final Thoughts

In ~5 hours (spread across usage caps), I went from idea → production-ready YouTube chapter generator.

Claude wasn’t just answering prompts — it acted like a:

- **UX researcher** — mapping user journeys and accessibility needs
- **Sprint planner** — breaking down tasks and prioritizing features  
- **UI designer** — creating detailed component specifications
- **Whimsy injector** — adding delightful micro-interactions
- **Frontend engineer** — building polished, responsive components
- **Backend architect** — designing robust API endpoints and error handling

All in one.

Agentic development is fast, structured, and surprisingly fun.

Next up? I want to use Claude’s subagent to auto-generate full design systems — because if it can do this for an app, why not for your company’s UI kit? 👀

Until next time,
happy coding!

Kedasha 💻✨