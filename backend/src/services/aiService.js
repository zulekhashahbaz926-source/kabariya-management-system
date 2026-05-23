/**
 * AI Service Simulator
 * Simulates high-quality, domain-specific AI processing.
 * Returns contextual responses, structured quiz questions, summaries, and recommendations.
 */

// A directory of predefined topic answers to make the study assistant feel real and intelligent
const KNOWLEDGE_BASE = {
  solid: {
    response: `### 🌟 Understanding SOLID Principles

SOLID is a mnemonic acronym for five design principles intended to make software designs more understandable, flexible, and maintainable. Here is a breakdown:

1. **Single Responsibility Principle (SRP)**
   * *Concept*: A class should have one, and only one, reason to change.
   * *Example*: Separating User data representation from User Database operations.

2. **Open/Closed Principle (OCP)**
   * *Concept*: Software entities (classes, modules, functions) should be open for extension, but closed for modification.
   * *Example*: Implementing a \`PaymentProcessor\` interface that allows adding new processors (like GooglePay) without modifying existing codebase.

3. **Liskov Substitution Principle (LSP)**
   * *Concept*: Objects of a superclass should be replaceable with objects of its subclasses without breaking the application.

4. **Interface Segregation Principle (ISP)**
   * *Concept*: A client should never be forced to depend on methods it does not use. Large interfaces should be split into smaller, specific ones.

5. **Dependency Inversion Principle (DIP)**
   * *Concept*: High-level modules should not depend on low-level modules. Both should depend on abstractions.

\`\`\`javascript
// Good DIP Example:
class UserRegistry {
  constructor(databaseConnector) { // depends on abstraction
    this.db = databaseConnector;
  }
  save(user) {
    this.db.insert(user);
  }
}
\`\`\``,
    quiz: [
      {
        question: "Which SOLID principle states that 'Software entities should be open for extension, but closed for modification'?",
        options: ["Single Responsibility Principle", "Open/Closed Principle", "Liskov Substitution Principle", "Dependency Inversion Principle"],
        answer: 1,
        explanation: "The Open/Closed Principle (OCP) ensures you can extend class behaviors through inheritance or interfaces without altering the original tested code."
      },
      {
        question: "What is a major symptom of violating the Single Responsibility Principle?",
        options: ["Too many interfaces in the system", "Large 'God classes' that handle unrelated business logic", "Slow database connection pools", "Unused dependencies"],
        answer: 1,
        explanation: "Violating SRP leads to monolithic classes (God objects) that combine database, presentation, and logic, making them extremely fragile to changes."
      }
    ],
    summary: `### 📝 Summary: SOLID Design Principles
* **Core Goal**: Create highly modular, loosely coupled software systems that survive requirements drift.
* **Key Takeaway**: High-level modules must depend on abstractions (interfaces), not concrete details (classes).
* **Benefit**: Reduces regression bugs and simplifies writing automated unit tests.`
  },
  react: {
    response: `### ⚛️ React 18 & Server Components

React 18 introduced architectural upgrades, most notably **React Server Components (RSC)**.

* **Server Components**: Render on the server, send zero Javascript bundle size to the client, and can access data stores directly.
* **Client Components**: Instantiated with the \`'use client'\` directive. They support user interactivity (like \`useState\`, \`useEffect\`, and event handlers).

\`\`\`javascript
// Server Component (Default in Next.js App Router)
import { db } from '@/lib/db';

export default async function ProductList() {
  const products = await db.query('SELECT * FROM products'); // Direct DB call!
  return (
    <ul>
      {products.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}
\`\`\``,
    quiz: [
      {
        question: "Which directive must be added to the top of a React file to make it a Client Component?",
        options: ["'use client'", "'enable client'", "'client-only'", "React components are client-side by default"],
        answer: 0,
        explanation: "Adding 'use client' at the top of a file signals the bundler to include it in the client-side JavaScript package, enabling React hooks."
      },
      {
        question: "What is a primary benefit of React Server Components?",
        options: ["They enable absolute security against XSS", "They reduce the JavaScript bundle size shipped to the client", "They allow direct execution of shell scripts", "They run faster than native WebAssembly"],
        answer: 1,
        explanation: "Since RSCs render on the build or API server, their code and dependencies are not bundled into the client's download, speeding up load times."
      }
    ],
    summary: `### 📝 Summary: React Server Components
* **Separation of Concerns**: Server Components manage heavy data fetching; Client Components manage UI state & actions.
* **Bundle Reduction**: Reduces Javascript bundle sizes dramatically, improving SEO and Core Web Vitals.
* **Direct Server Access**: Simplifies database queries directly in the components without writing middleware REST endpoints.`
  },
  devops: {
    response: `### 🚀 DevOps & CI/CD Pipelines

DevOps is a set of practices that combines software development (Dev) and IT operations (Ops) to shorten the systems development life cycle and provide continuous high-quality delivery.

* **CI (Continuous Integration)**: Automated building and testing of code commits to find bugs early.
* **CD (Continuous Deployment)**: Automating the release of validated builds to staging or production environments.

\`\`\`yaml
# Simple GitHub Actions CI Pipeline Config:
name: Node.js CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm test
\`\`\``,
    quiz: [
      {
        question: "What does the 'CI' in CI/CD stand for?",
        options: ["Continuous Infrastructure", "Continuous Integration", "Compiled Instance", "Centralized Index"],
        answer: 1,
        explanation: "Continuous Integration is the practice of automating the integration of code changes from multiple contributors into a single software project."
      },
      {
        question: "What is the purpose of Infrastructure as Code (IaC)?",
        options: ["To write system code directly in assembly", "To manage and provision server resources through definition files", "To encrypt API keys in database storage", "To automatically translate CSS into Javascript"],
        answer: 1,
        explanation: "IaC tools like Terraform or CloudFormation allow infrastructure configuration to be versioned, tested, and tracked in Git repositories."
      }
    ],
    summary: `### 📝 Summary: DevOps and CI/CD
* **Automation**: Eliminates human error during building, testing, and server deployment.
* **Consistency**: Standardizes environment execution profiles (typically using Docker containerization).
* **Velocity**: Shortens the loop between writing a feature and delivering it to production users.`
  }
};

const getChatResponse = async (userMessage) => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));

  const normalized = userMessage.toLowerCase();
  
  // Look for keywords
  let topicKey = null;
  if (normalized.includes('solid') || normalized.includes('design pattern') || normalized.includes('clean code')) {
    topicKey = 'solid';
  } else if (normalized.includes('react') || normalized.includes('next.js') || normalized.includes('frontend')) {
    topicKey = 'react';
  } else if (normalized.includes('devops') || normalized.includes('docker') || normalized.includes('ci/cd') || normalized.includes('pipeline')) {
    topicKey = 'devops';
  }

  if (topicKey) {
    return KNOWLEDGE_BASE[topicKey].response;
  }

  // Generic AI Assistant response
  return `### 🤖 AI Study Assistant response

Hello! I am your AI Study Assistant. I am specialized in:
- **Software Engineering & Design Principles** (Ask me about *SOLID* or *Design Patterns*)
- **Web Development** (Ask me about *React Server Components* or *Next.js*)
- **DevOps Pipelines** (Ask me about *CI/CD* or *Docker*)

You asked: "${userMessage}"

**How I can help with this:**
If you need specific coding templates, quiz questions, or content summaries, just mention one of my expert topics (e.g. *solid*, *react*, or *devops*), and I will generate a structured response for you! Let me know what you'd like to study.`;
};

const generateQuiz = async (topic) => {
  await new Promise(resolve => setTimeout(resolve, 600));

  const normalized = topic.toLowerCase();
  let selectedTopic = 'solid'; // Default fallback
  
  if (normalized.includes('react') || normalized.includes('next') || normalized.includes('web')) {
    selectedTopic = 'react';
  } else if (normalized.includes('devops') || normalized.includes('ci') || normalized.includes('pipeline') || normalized.includes('git')) {
    selectedTopic = 'devops';
  }

  return {
    topic: selectedTopic === 'solid' ? 'SOLID Principles' : selectedTopic === 'react' ? 'React Server Components' : 'DevOps Pipelines',
    questions: KNOWLEDGE_BASE[selectedTopic].quiz
  };
};

const generateSummary = async (content) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const normalized = content.toLowerCase();
  let selectedTopic = 'solid';
  
  if (normalized.includes('react') || normalized.includes('next') || normalized.includes('web')) {
    selectedTopic = 'react';
  } else if (normalized.includes('devops') || normalized.includes('ci') || normalized.includes('pipeline')) {
    selectedTopic = 'devops';
  }

  return KNOWLEDGE_BASE[selectedTopic].summary;
};

module.exports = {
  getChatResponse,
  generateQuiz,
  generateSummary
};
