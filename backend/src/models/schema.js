const { run, query } = require('../config/db');
const bcrypt = require('bcryptjs');

const initDatabase = async () => {
  try {
    console.log('Initializing database tables...');

    // 1. Users Table
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'student',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Courses Table
    await run(`
      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        instructor TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        discount_price REAL,
        rating REAL DEFAULT 5.0,
        image_url TEXT,
        syllabus TEXT NOT NULL, -- JSON string
        resources TEXT          -- JSON string (downloadable assets)
      )
    `);

    // 3. Enrollments Table
    await run(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        progress INTEGER DEFAULT 0,
        completed_chapters TEXT DEFAULT '[]', -- JSON string of completed chapter indices
        status TEXT DEFAULT 'active',          -- active, completed
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        UNIQUE(user_id, course_id)
      )
    `);

    // 4. Reviews Table
    await run(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
        review_text TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      )
    `);

    // 5. Bookmarks Table
    await run(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        UNIQUE(user_id, course_id)
      )
    `);

    // 6. Quizzes Table
    await run(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        course_id INTEGER,
        topic TEXT NOT NULL,
        questions TEXT NOT NULL, -- JSON string of quiz questions
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 7. Chat History Table
    await run(`
      CREATE TABLE IF NOT EXISTS chat_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        response TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('Database tables verified/created successfully.');

    // Seed Courses if empty
    const courseCount = await query('SELECT COUNT(*) as count FROM courses');
    if (courseCount[0].count === 0) {
      console.log('Seeding initial digital courses...');
      await seedCourses();
    }
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  }
};

const seedCourses = async () => {
  const courses = [
    {
      title: 'Software Architecture & Design Patterns Masterclass',
      description: 'Master clean architecture, SOLID principles, creational, structural, and behavioral design patterns in Node.js and Java. Build resilient, scalable, and maintainable enterprise software systems.',
      instructor: 'Dr. Sarah Jenkins',
      category: 'Software Engineering',
      price: 99.99,
      discount_price: 79.99,
      rating: 4.8,
      image_url: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=600&q=80',
      syllabus: JSON.stringify([
        { id: 1, title: 'Introduction to Software Design Patterns', duration: '20 mins', preview: true },
        { id: 2, title: 'Deep Dive: SOLID Design Principles', duration: '45 mins', preview: true },
        { id: 3, title: 'Creational Patterns (Factory, Singleton, Builder)', duration: '60 mins', preview: false },
        { id: 4, title: 'Structural Patterns (Adapter, Decorator, Facade)', duration: '55 mins', preview: false },
        { id: 5, title: 'Behavioral Patterns (Observer, Strategy, State)', duration: '70 mins', preview: false },
        { id: 6, title: 'Clean Architecture Blueprint & Project Structure', duration: '90 mins', preview: false }
      ]),
      resources: JSON.stringify([
        { name: 'SOLID Cheat Sheet (PDF)', size: '2.4 MB', link: '/downloads/solid_cheatsheet.pdf' },
        { name: 'Design Patterns Code Repository (ZIP)', size: '15.8 MB', link: '/downloads/patterns_code.zip' }
      ])
    },
    {
      title: 'AI Engineering & Deep Learning BootCamp',
      description: 'Learn to build, train, and deploy Neural Networks, Large Language Models (LLMs), and RAG pipelines. Integrate state-of-the-art AI features into modern full-stack web applications.',
      instructor: 'Prof. Alan Turing Jr.',
      category: 'Artificial Intelligence',
      price: 149.99,
      discount_price: 119.99,
      rating: 4.9,
      image_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80',
      syllabus: JSON.stringify([
        { id: 1, title: 'Machine Learning vs. Deep Learning Concepts', duration: '30 mins', preview: true },
        { id: 2, title: 'Building your First Neural Network in PyTorch', duration: '55 mins', preview: true },
        { id: 3, title: 'Natural Language Processing and Transformer Architectures', duration: '80 mins', preview: false },
        { id: 4, title: 'Working with LLMs and Prompt Engineering', duration: '65 mins', preview: false },
        { id: 5, title: 'Implementing Retrieval-Augmented Generation (RAG)', duration: '90 mins', preview: false },
        { id: 6, title: 'Deploying AI Models at Scale with Docker & FastAPI', duration: '75 mins', preview: false }
      ]),
      resources: JSON.stringify([
        { name: 'NLP Transformers Cheat Sheet (PDF)', size: '1.8 MB', link: '/downloads/transformers_cheatsheet.pdf' },
        { name: 'Jupyter Notebooks Notebooks (ZIP)', size: '24.5 MB', link: '/downloads/dl_notebooks.zip' }
      ])
    },
    {
      title: 'Modern Front-End Mastery: Next.js 14 & React',
      description: 'Go from beginner to advanced in React and Next.js. Master Server Components, Server Actions, App Router, global state management, responsive designs, and fluid CSS micro-animations.',
      instructor: 'Alex Rivera (Staff Engineer)',
      category: 'Web Development',
      price: 89.99,
      discount_price: 49.99,
      rating: 4.7,
      image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80',
      syllabus: JSON.stringify([
        { id: 1, title: 'React 18 Architecture and State Reconciliation', duration: '25 mins', preview: true },
        { id: 2, title: 'Next.js App Router Fundamentals', duration: '40 mins', preview: true },
        { id: 3, title: 'React Server Components (RSC) vs. Client Components', duration: '50 mins', preview: false },
        { id: 4, title: 'Data Fetching, Caching, and Server Actions', duration: '65 mins', preview: false },
        { id: 5, title: 'Premium Styling: CSS Modules, Gradients, and Glassmorphism', duration: '60 mins', preview: false },
        { id: 6, title: 'Production Deployments & Core Web Vitals Optimization', duration: '50 mins', preview: false }
      ]),
      resources: JSON.stringify([
        { name: 'Next.js 14 Architecture Map (PDF)', size: '3.1 MB', link: '/downloads/nextjs_architecture.pdf' },
        { name: 'Premium UI CSS Templates (CSS)', size: '450 KB', link: '/downloads/premium_css.zip' }
      ])
    },
    {
      title: 'DevOps & CI/CD Pipeline Automation',
      description: 'Master Git, GitHub Actions, Docker, Kubernetes, and Terraform. Build robust automated CI/CD pipelines to build, test, and deploy applications to AWS and Render with zero-downtime.',
      instructor: 'Marcus Vance',
      category: 'Software Engineering',
      price: 119.99,
      discount_price: null,
      rating: 4.6,
      image_url: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=600&q=80',
      syllabus: JSON.stringify([
        { id: 1, title: 'Fundamentals of DevOps and Infrastructure as Code', duration: '15 mins', preview: true },
        { id: 2, title: 'Git Branching Strategies & Peer Review Workflow', duration: '35 mins', preview: true },
        { id: 3, title: 'Containerization with Docker & Docker Compose', duration: '60 mins', preview: false },
        { id: 4, title: 'GitHub Actions: Writing your First CI Workflow', duration: '50 mins', preview: false },
        { id: 5, title: 'Kubernetes Orchestration & Helm Charts', duration: '80 mins', preview: false },
        { id: 6, title: 'Zero-Downtime Deployments & Blue-Green Architectures', duration: '70 mins', preview: false }
      ]),
      resources: JSON.stringify([
        { name: 'Docker & K8s Command Guide (PDF)', size: '1.2 MB', link: '/downloads/docker_k8s_guide.pdf' },
        { name: 'CI/CD YAML Templates (YAML)', size: '120 KB', link: '/downloads/pipeline_templates.zip' }
      ])
    }
  ];

  for (const course of courses) {
    await run(`
      INSERT INTO courses (title, description, instructor, category, price, discount_price, rating, image_url, syllabus, resources)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      course.title,
      course.description,
      course.instructor,
      course.category,
      course.price,
      course.discount_price,
      course.rating,
      course.image_url,
      course.syllabus,
      course.resources
    ]);
  }
  console.log('Seeded 4 courses into the database.');
};

module.exports = {
  initDatabase
};
