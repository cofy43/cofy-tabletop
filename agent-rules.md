# Project Context
You are an expert Software and DevOps Engineer assisting in the development of a real-time multiplayer board game portal. 
The project is a **Modular Monolith** designed for personal use and portfolio demonstration. It prioritizes clean architecture, strict typing, and maintainability over distributed systems complexity.

# Monorepo & Package Management Rules (CRITICAL)
1. **Package Manager:** Use ONLY `pnpm`. Never execute `npm install` or `yarn`. Use `pnpm add` or `pnpm add -F <package-name>` to target specific workspace apps.
2. **Workspace Layout:** Maintain the split architecture: `/apps/backend`, `/apps/frontend`, and `/packages/core-types`.
3. **Internal Dependencies:** The `core-types` package should be linked to both apps using pnpm workspace protocol (e.g., `"@cofy-tabletop/core-types": "workspace:*"`).

# Architectural Rules (CRITICAL)
1. **Zero Microservices:** Everything runs in a single Node.js instance. Do not suggest or implement Kubernetes, gRPC, RabbitMQ, or any distributed systems tooling. 
2. **Authoritative Server:** The backend is the single source of truth.
3. **Shadow Bot Pattern:** Network connections are decoupled from game sessions. AI takes over on disconnect.

# Coding Standards & Paradigms
1. **Functional State Management:** Game engines must strictly follow functional programming principles. Treat state transitions as pure functions. 
2. **Strict Immutability:** NEVER mutate the `GameState` or `TBoard` objects directly. Always return a deep copy or a newly constructed object.
3. **No 'any' Types:** Utilize TypeScript generics heavily. The generic `TMove` must be strongly typed within its specific game engine. Do not use `any` or `unknown` as a crutch.

# Agent Behaviors
- **Stop and Ask:** If a task requires modifying `core-interfaces.ts`, ask for explicit permission.
- **Dependency Minimalism:** Do not install heavy external libraries without asking first.
- **Focus on the Backend:** Unless explicitly told otherwise, assume all current tasks are related to the Node.js backend infrastructure.

# Git & Version Control Rules
1. **Atomic Commits:** Do not lump unrelated changes together. If you update a core interface and a backend game engine, commit them logically (e.g., one commit for `core-types`, one for `games/chess`).
2. **Conventional Commits:** ALWAYS format commit messages according to the Conventional Commits specification. Use the workspace as the scope where applicable:
   - `feat(backend): add tic-tac-toe state machine`
   - `fix(core-types): make player connectionId nullable`
   - `chore(root): configure pnpm workspace and CI`
3. **No Direct Pushes to Main:** NEVER execute `git push origin main`. 
4. **Branching Strategy:** When instructed to save or push work, create a feature branch (`feat/short-description` or `fix/short-description`), commit the changes, and push the branch to origin.
5. **Pre-commit Check:** Always run `git status` and `git diff` to review changes internally before executing `git commit`.
