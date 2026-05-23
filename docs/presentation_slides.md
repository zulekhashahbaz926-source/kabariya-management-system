# AI LearnHub - Semester Project Slide Deck Outline

This file contains the slide deck outline for the course presentation of the semester project.

---

### Slide 1: Title Slide
* **Title**: AI LearnHub – Smart AI Learning Platform & Digital Course Store
* **Sub-title**: University Semester Project: Software Construction & Development (SCD)
* **Team Members**: [Student Name 1], [Student Name 2], [Student Name 3]
* **Course Info**: CS 302 - Software Construction & Development, Spring Semester

### Slide 2: Project Overview & Motivation
* **The Problem**: Traditional EdTech platforms are static management systems (LMS) with no real-time personalized study assistance.
* **Our Solution**: Build a modern, full-stack digital course storefront integrated with simulated real-time AI Tutor Dialogues, automated AI-generated Quizzes, and personalized recommendation metrics.
* **Key Goal**: Focus on modern Software Engineering practices (Agile Scrum, Refactoring, CI/CD models, Jest unit testing, and peer inspections).

### Slide 3: System Architecture & Tech Stack
* **Frontend**: React.js SPA initialized with Vite for rapid building. Designed with pure custom Glassmorphic CSS.
* **Backend**: Node.js & Express REST API using modular router-controller architecture.
* **Database**: SQLite promises-based wrapper (facilitates instant zero-configuration local execution for graders).
* **AI Modules**: Built-in algorithmic AI Simulator supporting domain chatbot answers, summarization, and recommendation weights.

### Slide 4: Agile Scrum Process Model
* **Why Agile over Waterfall**: Requirements in EdTech evolve based on student feedback; Waterfall is too rigid.
* **Sprint Breakdown**:
  * *Sprint 1*: Database modeling & Auth REST endpoints.
  * *Sprint 2*: Frontend storefront UI & simulated checkout exceptions.
  * *Sprint 3*: AI Chatbot integration & custom quiz generators.
  * *Sprint 4*: Unit testing suites, code reviews, and project packaging.

### Slide 5: Core Features Showcase (Demo Highlights)
* **Storefront**: High-fidelity digital course preview, filter selections, and mock checkout panel.
* **Student Dashboard**: Progress tracking, saved courses, and study hours metrics.
* **Interactive Classroom**: Video simulation, downloadable PDF assets, and rating forms.

### Slide 6: Intelligent Cognitive Features
* **AI Tutor Chatbot**: Floating companion giving technical insights, code snippets, and study explanations.
* **Personalized Recommendations**: Adaptively scores remaining courses based on user category affinities (bookmarks, enrollments) and course quality rating variables.
* **Contextual Quizzes**: Creates test questions directly matching lecture topics with clear solutions.

### Slide 7: Version Control & Git Branching Strategy
* **Main Branch**: Houses production-ready code (Vercel/Render ready).
* **Develop Branch**: Integration branch for completed feature branches.
* **Feature Branches** (`feature/auth`, `feature/ai-quiz`): Developers write code in isolation.
* **Merge Flow**: Feature -> Pull Request -> Peer Review approval -> Develop -> Main.

### Slide 8: Refactoring & Legacy Code Removal
* **Legacy Smell**: Spaghetti code containing callback hell, SQL injection risks, and $O(N^2)$ nested loops querying db records.
* **Clean Code Actions**:
  * Extracted logic to single-responsibility pure functions.
  * Replaced database string concatenation with parameterized SQL bindings.
  * Upgraded nested iteration maps to async/await Promise pipelines ($O(N)$ efficiency).

### Slide 9: Robust Quality Assurance (Testing & Inspections)
* **Unit Testing**: Jest test cases testing JWT auth, checkout failure edge cases, quiz data structures, and recommendation weights.
* **API Testing**: Express integration tests using `supertest`.
* **Peer Reviews**: Code walkthroughs, team inspection checklists, and bug track logs.

### Slide 10: Lehman's Laws of Software Evolution
* **Law of Continuing Change**: Platform must expand (e.g. adding AI features) or risk obsolescence.
* **Law of Increasing Complexity**: As features expand, code complexity swells; countered with active refactoring cycles.
* **Law of Self Regulation**: Scrum velocities adjusted to manage feature creep.

### Slide 11: Team Roles & Contributions
* **Project Manager / PM**: Sprint planning, Git maintenance, Agile standups.
* **UI/UX Designer & Frontend Dev**: Core theme design, responsive components.
* **Backend & DB Engineer**: SQLite integration, JWT middleware, exception routes.
* **QA & Test Engineer**: Jest suite writing, manual browser checklists, peer reviews.

### Slide 12: Learning Outcomes & Conclusion
* **Outcomes**: Practical experience with Agile Scrum models, version control collaboration, Jest test automation, and code smell refactoring.
* **Future scope**: Transitioning SQLite to PostgreSQL, integrating live OpenAI API keys, adding multiplayer study rooms.
* **Q&A**: Opening floor for professor questions.
