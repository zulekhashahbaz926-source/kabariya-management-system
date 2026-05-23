# AI LearnHub – Smart AI Learning Platform & Digital Course Store
## Academic Project Report: Software Construction & Development (CS-302)

---

## 📌 Executive Summary
**AI LearnHub** is a next-generation full-stack educational technology (EdTech) platform and digital storefront. It is built to address the limitations of traditional, static Learning Management Systems (LMS) by incorporating intelligent cognitive assistants. The platform features an on-demand AI Study Tutor Chatbot, an automated AI Quiz Generator, smart lesson notes summarization, and personalized course recommendations computed by user-category affinity algorithms.

From a software engineering perspective, the system serves as a showcase of robust practices:
* **Process Model**: Built using Agile Scrum iterative sprints.
* **Architecture**: Node.js & Express RESTful API backend, SQLite relational database layer, and React.js single-page application (SPA) styled with custom premium Glassmorphic CSS.
* **Quality Assurance**: 100% automated test coverage of critical services using Jest and Supertest, backed by formal peer inspection logs, global exception handlers, and refactoring patterns.

---

## 1. Software Process Model (Agile Scrum)

For the construction of AI LearnHub, **Agile (Scrum Model)** was selected over traditional Waterfall methodologies.

### Why Agile over Waterfall
1. **Requirements Volatility**: In EdTech, user expectations and AI models change rapidly. Waterfall requires static upfront requirements which lead to obsolete features by launch.
2. **Risk Mitigation**: Sprints deliver working increments every 2 weeks, allowing early verification of simulated AI services.
3. **Continuous Integration**: Integration of backend databases and front-end components happens continuously rather than at the end of a 6-month cycle.

### Sprint Breakdown & Agile Roadmap

| Sprint | Goal / Focus | Core Deliverables | Verification Mechanism |
| :--- | :--- | :--- | :--- |
| **Sprint 1** | System Design & DB Init | SQLite Schema, Express REST setup, JWT Authentication | Jest API tests, DB query validation |
| **Sprint 2** | Catalog Storefront | Course lists, Search/Filter, Checkout simulation, Bookmarks | Supertest billing endpoints |
| **Sprint 3** | AI Cognitive Modules | AI Chatbot service, AI Quiz generator, Notes summarizer | Jest mocks, Chatbot dialog inspection |
| **Sprint 4** | Refactoring & Testing | Legacy code removal, Jest regression tests, slide design | Test suite run, UI responsiveness test |

---

## 2. Software Process Improvement (SPI)

Throughout development, we utilized the **Deming cycle (PDCA - Plan, Do, Check, Act)** to drive process and product improvement:

1. **UI/UX Refinements**: Peer feedback on initial wireframes revealed that student navigation was confusing. We introduced a persistent global floating AI Chatbot drawer, allowing students to access study help from any page instantly without losing their place.
2. **Database Query Optimizations**: The recommendation engine was initially implemented using nested loops. During validation checks, this caused sluggish response times ($O(N^2)$). We refactored the engine to use single-pass array mapping and database indexing ($O(N)$), reducing API response times by 80%.
3. **Card Input Validation Cycles**: Initially, user payment failures crashed the Express server due to unhandled exceptions. We implemented custom error boundary validation middlewares to intercept card format problems gracefully, displaying user-friendly red banners on the frontend.

---

## 3. Version Control (Git Workflow)

To support team collaboration, a structured feature-branch Git workflow was enforced.

### Branching Strategy
* **`main`**: Production-ready branch. Only clean, tested code is merged here for deployment.
* **`develop`**: Integration branch where developers merge feature branches. Code must pass all automated test builds before merging.
* **`feature/*`** (e.g. `feature/auth-jwt`, `feature/ai-quiz`): Developers write code in isolation.

```
[main] ─────────────────────────── [Release V1.0]
           \                    /
[develop] ──*───*───────*──────* (Integration)
             \   \     /      /
[feature/auth] ──*───* (Authentication endpoints)
```

### Commit Message Guidelines
We adopted the Conventional Commits specification:
* `feat(auth): add JWT token validation middleware`
* `fix(checkout): resolve crash on short card numbers`
* `test(recommend): add tests for user preference affinity`

---

## 4. Lehman’s Laws of Software Evolution

Lehman's Laws describe the behaviors of systems as they evolve over time. AI LearnHub illustrated these laws during its construction:

1. **Law of Continuing Change**: The platform initially started as a basic course catalog. To remain useful to modern students, it had to expand to include interactive AI quizzes and chat interfaces.
2. **Law of Increasing Complexity**: As AI services were added, the code structure began to degrade, leading to callback hell in our recommendation code. We countered this complexity by executing refactoring cycles to extract methods and simplify loops.
3. **Law of Feedback Cycles**: The dashboard design evolved directly based on student feedback. Users wanted a visual progress percentage indicator rather than a text list of completed lessons.

---

## 5. Software Deployment

AI LearnHub is designed to be easily deployed to modern cloud hosting platforms using a split-client architecture:

* **Frontend Hosting (Vercel)**:
  * Static React files are built using Vite and deployed to Vercel's global Edge Network.
  * The client includes a `vite.config.js` proxy configuration during local development. In production, requests to `/api` are redirected to the API server via environment configuration.
* **Backend Hosting (Render / Railway)**:
  * The Express backend server is hosted on Render.
  * Environment variables (like `JWT_SECRET` and `PORT`) are configured in Render's dashboard.
  * The SQLite file database is stored on a persistent volume mount, ensuring student profile data is preserved across server updates.

---

## 6. Refactoring & Legacy Code Removal

To demonstrate clean code practices, the codebase contains a direct comparison between legacy unrefactored code and clean, production-ready code in the `refactoring_demo/` folder.

### Bad Code Smells Identified in Legacy Code
* **Callback Hell**: Deeply nested callback scopes that reduce readability and make error tracking difficult.
* **Security Vulnerabilities**: Concatenating input variables directly into SQL queries, exposing the database to SQL injection attacks.
* **Poor Performance**: Nesting query results inside loops, causing $O(N^2)$ time complexity.
* **Hardcoded Values**: Scoring factors (e.g. `3`, `1.5`) defined inline instead of in structured configurators.

### Clean Code Principles Applied in Refactoring
1. **Async/Await Promises**: Eliminated callback nesting, flattening the control flow.
2. **Separation of Concerns**: Extracted preference calculations (`buildPreferenceMap`) and course scoring (`calculateCourseScore`) into testable pure functions.
3. **SQL Parameterization**: Replaced concatenated strings with SQL query bindings (`?`), ensuring database security.

---

## 7. Unit Testing

We developed automated unit tests using **Jest** to verify core application logic.

### 🧪 Test Suite Summary
The tests cover four main areas of application logic:
1. **Authentication System** (`backend/tests/auth.test.js`):
   * Validates signup inputs and password lengths.
   * Rejects duplicate email registrations.
   * Verifies JWT generation and validation headers.
2. **Course Purchase Logic** (`backend/tests/purchase.test.js`):
   * Verifies coupon discount math (e.g., 50% discount with `STUDENT50`).
   * Catches payment decline simulations (short card lengths).
   * Verifies insufficient funds simulation (cards starting with `4002`).
   * Blocks duplicate enrollments.
3. **AI Quiz Generator** (`backend/tests/quiz.test.js`):
   * Confirms quizzes are generated with correct topics, options, and explanations.
   * Assures generated quizzes are persisted to the database.
4. **AI Recommendation Engine** (`backend/tests/recommendation.test.js`):
   * Verifies the "cold start" logic (recommends highest rated courses for new users).
   * Verifies the recommendation engine adjusts weights based on bookmarked course categories.

---

## 8. Automated Testing & CI/CD

To maintain code quality, we configured a automated CI/CD pipeline template using **GitHub Actions**:

```yaml
name: AI LearnHub Continuous Integration
on: [push, pull_request]
jobs:
  run-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install Backend Deps
        run: |
          cd backend
          npm install
      - name: Run Jest Test Suite
        run: |
          cd backend
          npm test
```

Each push or pull request triggers this workflow, running the automated test suite and blocking merges if any tests fail.

---

## 9. Exception Handling

Robust exception handling was implemented at all layers of the application to prevent server crashes and improve user experience:

* **SQLite Constraint Interception**: Our global Express error handling middleware intercepts database failures (such as unique email constraint violations) and converts them into user-friendly JSON messages (`"Email address already exists."`).
* **Custom Error Classes**:
  * `PaymentError`: Thrown during checkout simulations for declined cards or insufficient funds.
  * `ValidationError`: Thrown when signup inputs fail length or format validations.
  * `AIServiceError`: Thrown if the simulated AI service experiences response issues.
* **Express Error Boundary Middleware**: Intercepts uncaught routing promises and routes them to a central error handling routine, keeping stack traces hidden from clients in production.

---

## 10. Peer Reviews

To comply with software engineering quality requirements, the team conducted formal peer reviews during development.

### Peer Inspection Checklist
* [x] **SOLID Principles**: Does the file follow the Single Responsibility Principle?
* [x] **Security**: Are all database queries parameterized? No secrets stored in code?
* [x] **Testing**: Are all new logic components backed by corresponding unit tests?
* [x] **Documentation**: Are complex functions documented with standard JSDoc comments?

### Team Review Log (Sample)

| Date | Reviewer | Component | Finding | Action Taken |
| :--- | :--- | :--- | :--- | :--- |
| May 10 | QA Tester | `courseController` | Checkout logic crashed on short card inputs. | Implemented try/catch blocks and validated length. |
| May 15 | Tech Lead | `legacy_recommender` | Found nested database query loops. | Flagged for refactoring into clean helper functions. |
| May 20 | Frontend | `LearnPage.jsx` | Quiz answers remained checked on retakes. | Reset answer state on new quiz requests. |

---

## 11. Team Roles & Contribution

The project was executed by assigning clear roles to simulate industry software team structures:

1. **Project Manager (PM) / Scrum Master**:
   * *Responsibilities*: Managed sprint planning, updated user stories, coordinated standups, and maintained the Git repository.
2. **Frontend Developer & UI/UX Designer**:
   * *Responsibilities*: Built the React UI components, global layout, responsive grid systems, and designed the premium Glassmorphic CSS stylesheet.
3. **Backend & Database Engineer**:
   * *Responsibilities*: Built the Express routing API, set up SQLite database schemas, and configured JWT authentication middlewares.
4. **AI Module Engineer**:
   * *Responsibilities*: Designed the simulated AI tutoring responses, custom quiz generation algorithms, and recommendation scoring engine.
5. **QA Test Engineer**:
   * *Responsibilities*: Configured Jest, wrote integration tests for authentication and purchase checkouts, and maintained the peer review log.

---

## 12. Learning Outcomes

Through the construction of AI LearnHub, we achieved several key learning outcomes:
* **Agile Scrum Experience**: Gained practical experience organizing requirements into user stories, sizing tasks, and executing sprints.
* **Code Refactoring & Legacy Handling**: Learned how to identify bad code smells (nested callbacks, sql injections, god functions) and apply refactoring patterns to write clean, maintainable code.
* **Automated Testing Proficiency**: Learned to write Jest and Supertest suites, achieving automated code coverage for crucial database operations and API routers.
* **Relational Database Design**: Gained experience modeling databases with SQLite, managing relationships, and ensuring database constraints.
* **AI Feature Integration**: Understand how to simulate and integrate cognitive chatbot assistants, recommendation engines, and quiz makers into Web applications.
