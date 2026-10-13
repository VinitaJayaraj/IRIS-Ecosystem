# IRIS - Intelligent Responsive Individualized Study Ecosystem

IRIS is an advanced AI-powered learning workspace featuring specialized AI mentors (Mathematics, Science, Coding Coach, Literature, Career Strategist, and Research Assistant), interactive learning widgets, and a dual-engine AI backend.

---

## 🚀 Quick Start

Run the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📚 Technical Documentation & System Diagrams

Full technical specifications, database schemas, field definitions, ER diagrams, and Mermaid system flow diagrams are documented in **[TECHNOLOGY_STACK.md](./TECHNOLOGY_STACK.md)**:

- **[Database Schemas & Field Specs](./TECHNOLOGY_STACK.md#3-database-schema--fields-specification)**: Tables (`iris_users`, `iris_session`, `iris_conversations`, `iris_tasks`, `iris_dna`, `KNOWLEDGE_BASE`) with data types, keys, and constraints.
- **[Entity Relationship (ER) Diagram](./TECHNOLOGY_STACK.md#4-entity-relationship-er-diagram)**: Visualized database schema relationships.
- **[System Execution Sequence Diagram](./TECHNOLOGY_STACK.md#5-system-execution--data-flow-diagram)**: Step-by-step Mermaid sequence diagram of student prompts, AI API routing, built-in knowledge engines, and local persistence.
- **[Architecture Flow Diagram](./TECHNOLOGY_STACK.md#6-comprehensive-system-architecture-flow-diagram)**: Layered client-server architecture flow.

---

## 🧬 Core Features

- **Multi-Agent AI Mentors**: 6 specialized subject tutors.
- **Dual-Engine Processing**: Supports live OpenAI/Gemini API calls and a self-contained offline dataset (`src/lib/knowledgeBase.ts`).
- **Interactive Widgets**: Mathematics Chalkboard, Code Sandbox Editor, Science Simulation Lab, Rhetoric Reviewer, Career Path Roadmap, and Citation Generator.
- **LaTeX & Markdown Formatting**: Clean mathematical renderer converting raw LaTeX into formatted notation.
