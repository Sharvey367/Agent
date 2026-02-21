# CLAUDE.md

This file provides guidance for AI assistants working with the **Agent** repository.

## Repository Overview

This is the **Agent** project owned by `Sharvey367`. The repository is in its initial state and conventions documented here should be followed as the codebase evolves.

## Project Structure

```
Agent/
├── CLAUDE.md          # AI assistant guidance (this file)
└── (project files to be added)
```

Update this section as the project grows to reflect the actual directory layout.

## Development Workflow

### Branch Strategy

- **Main branch**: `main` — stable, production-ready code
- **Feature branches**: Use the pattern `claude/<description>-<id>` for AI-assisted work
- Always develop on feature branches; never push directly to `main`

### Commits

- Write clear, concise commit messages that explain *why* a change was made
- Keep commits focused — one logical change per commit
- End commit messages with the Claude Code session link when working in a Claude session

### Pull Requests

- PRs should include a summary section and a test plan
- Link related issues in the PR description

## Build & Test

*(Update this section once build tooling and test frameworks are chosen.)*

- Document the build command here (e.g., `npm run build`, `cargo build`, `make`)
- Document the test command here (e.g., `npm test`, `pytest`, `cargo test`)
- Document the lint command here (e.g., `npm run lint`, `ruff check .`)

## Code Style & Conventions

*(Update this section as project conventions are established.)*

- Follow the language-idiomatic style guide for whatever language is adopted
- Prefer simple, readable code over clever abstractions
- Only add comments where the logic is not self-evident
- Keep functions focused and small

## Key Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | AI assistant guidance and project documentation |

Update this table as important files are added to the project.

## Common Tasks

*(Add common development tasks and their commands here as the project matures.)*

## Dependencies

*(List key dependencies and their purposes once they are added.)*

## Environment Setup

*(Document environment setup steps, required tools, and configuration once established.)*
