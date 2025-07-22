# AGENTS Instructions

This file outlines best practices for developers and automated agents interacting with this repository.

## Development setup

- Use **Node.js 18** or newer.
- Install dependencies with `npm install`.
- Environment variables should be stored in a local `.env` file. Do not commit this file.

## Code quality

- Run `npm run lint` before committing changes and fix all reported issues.
- Ensure the project builds by running `npm run build`.
- Add tests for new features where possible.

## Git workflow

- Create a feature branch from `main` for each change.
- Use concise commit messages following the style `type: short description` (e.g. `feat: add media upload page`).
- Open a pull request targeting `main` and describe the motivation for the change.

## Pull request review

- Make sure linting and build checks pass before requesting review.
- Reference related issues in the PR description.

