# Architecture: Cofy Tabletop

## Overview
A web portal for real-time multiplayer board games. Designed with a **Modular Monolith** approach (zero microservices) and structured as a **Monorepo** using `pnpm`.

## Tech Stack
* **Package Manager:** pnpm (Workspaces).
* **Backend (Core):** Node.js with strict TypeScript.
* **Real-Time:** Socket.io (Room and event management).
* **Frontend (Future):** React / Next.js.
* **Database (Future):** PostgreSQL for user profiles and match history persistence.
* **Testing:** Jest (TDD approach).

## Business Rules & Design
1. **Authoritative Server:** The backend validates all rules. The client is a passive view.
2. **Synchronicity:** Strictly turn-based games (State Snapshot sent after each move).
3. **Disconnection Handling (Shadow Bot):** If a player loses connection, an AI worker temporarily takes their place. If the human reconnects with their session token, they regain control.
4. **Open/Closed Principle:** Each game (e.g., Chess, Tic-Tac-Toe) is an isolated module inside `/apps/backend/src/games/` that strictly adheres to a domain contract without modifying the main orchestrator (`lobby`).
5. **Functional Paradigm:** Game engines operate as pure functions. They do not mutate state; they always return a newly generated state based on a validated move.
