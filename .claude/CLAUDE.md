## Project Overview
- This is a Next.js project (see `README.md`) using the `/src/app` directory for main app code, with API routes in `/src/api`.
- The project structure follows Next.js app directory conventions, but API endpoints are organized under `/src/api/chapters/` and `/src/api/youtube/`.
- Static assets are in `/public`.

## Key Patterns & Conventions
- **API Endpoints:** Place new endpoints in `/src/api/chapters/` or `/src/api/youtube/` as appropriate. Follow the file-based routing pattern of Next.js API routes.
- **Components:** UI components live in `/src/app/components/`.
- **Types:** Shared TypeScript types are in `/src/app/types/`.
- **Utilities:** Shared logic/utilities are in `/src/app/utils/`.
- **Styling:** Use global styles in `/src/app/globals.css` and component-level styles as needed.
- **Config:** Project configuration files are at the root (e.g., `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`).

## Developer Workflows
- **Start Dev Server:** `npm run dev` (see `README.md`).
- **Build:** `npm run build`.
- **Lint:** `npm run lint`.
- **Test:** (No explicit test command found; add tests in future if not present.)
- **Changelog:** Log all code changes in `changelog.md` with date, description, and user prompt (see `.claude/CLAUDE.md`).

## Security & Testing
- Do not hardcode credentials or secrets.
- Validate all inputs in API endpoints.
- Add unit tests for new features and maintain at least 80% code coverage (see `.claude/CLAUDE.md`).
- Add integration tests for API endpoints.

## Testing Requirements
- Include unit tests for new functionality
- Maintain minimum 80% code coverage
- Add integration tests for API endpoints

# Change Logging
- Each time you generate code, note the changes in changelog.md
- Follow semantic versioning guidelines
- Include date, description, user prompt and description of changes

## Examples
- For a new API route: add a file in `/src/api/chapters/` or `/src/api/youtube/`.
- For a new UI component: add to `/src/app/components/` and import in relevant page.

## References
- See `README.md` for Next.js basics and dev workflow.
- See `.claude/CLAUDE.md` for security, changelog, and testing requirements.

---
If any conventions or workflows are unclear, ask for clarification or check referenced files.
