const { query, run, get } = require('../config/db');
const { getPersonalizedRecommendations } = require('../services/recommendationService');

const getCourses = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let sql = 'SELECT * FROM courses';
    const params = [];

    const conditions = [];
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    if (search) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    const courses = await query(sql, params);
    
    // Parse syllabus and resources
    const parsedCourses = courses.map(c => ({
      ...c,
      syllabus: JSON.parse(c.syllabus),
      resources: c.resources ? JSON.parse(c.resources) : []
    }));

    res.status(200).json({
      success: true,
      courses: parsedCourses
    });
  } catch (err) {
    next(err);
  }
};

const getCourseById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const course = await get('SELECT * FROM courses WHERE id = ?', [id]);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.'
      });
    }

    course.syllabus = JSON.parse(course.syllabus);
    course.resources = course.resources ? JSON.parse(course.resources) : [];

    // Fetch course reviews
    const reviews = await query(`
      SELECT r.*, u.username 
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.course_id = ?
      ORDER BY r.created_at DESC
    `, [id]);

    res.status(200).json({
      success: true,
      course,
      reviews
    });
  } catch (err) {
    next(err);
  }
};

const purchaseCourse = async (req, res, next) => {
  const { courseId, cardNumber, couponCode } = req.body;
  const userId = req.user.id;

  try {
    if (!courseId || !cardNumber) {
      const error = new Error('Course ID and card details are required.');
      error.name = 'ValidationError';
      throw error;
    }

    // 1. Fetch course details
    const course = await get('SELECT * FROM courses WHERE id = ?', [courseId]);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.'
      });
    }

    // 2. Check if already enrolled
    const existing = await get('SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?', [userId, courseId]);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course.'
      });
    }

    // 3. Payment Simulation with Exception Handling
    // Simulate invalid card length
    if (cardNumber.replace(/\s/g, '').length < 16) {
      const error = new Error('Simulated Payment Declined: Invalid credit card number format.');
      error.name = 'PaymentError';
      throw error;
    }

    // Simulate "4002" card leading to insufficient funds error
    if (cardNumber.startsWith('4002')) {
      const error = new Error('Simulated Payment Failed: Insufficient funds in this test card account.');
      error.name = 'PaymentError';
      throw error;
    }

    // Handle discounts/coupons
    let finalPrice = course.discount_price || course.price;
    if (couponCode) {
      if (couponCode.toUpperCase() === 'STUDENT50') {
        finalPrice = finalPrice * 0.5;
      } else {
        const error = new Error('Invalid coupon code.');
        error.name = 'ValidationError';
        throw error;
      }
    }

    // 4. Record enrollment in Database
    await run(
      'INSERT INTO enrollments (user_id, course_id, progress, completed_chapters) VALUES (?, ?, ?, ?)',
      [userId, courseId, 0, '[]']
    );

    res.status(201).json({
      success: true,
      message: 'Course purchased successfully!',
      transaction: {
        courseId,
        amountPaid: parseFloat(finalPrice.toFixed(2)),
        date: new Date().toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
};

const bookmarkCourse = async (req, res, next) => {
  const { courseId } = req.body;
  const userId = req.user.id;

  try {
    if (!courseId) {
      const error = new Error('Course ID is required.');
      error.name = 'ValidationError';
      throw error;
    }

    const bookmark = await get('SELECT * FROM bookmarks WHERE user_id = ? AND course_id = ?', [userId, courseId]);
    if (bookmark) {
      // Toggle off (unbookmark)
      await run('DELETE FROM bookmarks WHERE user_id = ? AND course_id = ?', [userId, courseId]);
      return res.status(200).json({
        success: true,
        bookmarked: false,
        message: 'Course removed from bookmarks.'
      });
    }

    // Toggle on (bookmark)
    await run('INSERT INTO bookmarks (user_id, course_id) VALUES (?, ?)', [userId, courseId]);
    res.status(201).json({
      success: true,
      bookmarked: true,
      message: 'Course bookmarked successfully.'
    });
  } catch (err) {
    next(err);
  }
};

const getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await query(`
      SELECT c.* 
      FROM bookmarks b
      JOIN courses c ON b.course_id = c.id
      WHERE b.user_id = ?
    `, [req.user.id]);

    const parsedBookmarks = bookmarks.map(c => ({
      ...c,
      syllabus: JSON.parse(c.syllabus),
      resources: c.resources ? JSON.parse(c.resources) : []
    }));

    res.status(200).json({
      success: true,
      bookmarks: parsedBookmarks
    });
  } catch (err) {
    next(err);
  }
};

const addReview = async (req, res, next) => {
  const { courseId, rating, reviewText } = req.body;
  const userId = req.user.id;

  try {
    if (!courseId || !rating) {
      const error = new Error('Course ID and rating are required.');
      error.name = 'ValidationError';
      throw error;
    }

    if (rating < 1 || rating > 5) {
      const error = new Error('Rating must be between 1 and 5.');
      error.name = 'ValidationError';
      throw error;
    }

    await run(`
      INSERT INTO reviews (user_id, course_id, rating, review_text)
      VALUES (?, ?, ?, ?)
    `, [userId, courseId, rating, reviewText]);

    // Update course average rating
    const avgData = await get('SELECT AVG(rating) as avgRating FROM reviews WHERE course_id = ?', [courseId]);
    if (avgData && avgData.avgRating) {
      await run('UPDATE courses SET rating = ? WHERE id = ?', [parseFloat(avgData.avgRating.toFixed(1)), courseId]);
    }

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully.'
    });
  } catch (err) {
    next(err);
  }
};

const updateCourseProgress = async (req, res, next) => {
  const { courseId, chapterId } = req.body;
  const userId = req.user.id;

  try {
    if (!courseId || chapterId === undefined) {
      const error = new Error('Course ID and chapter ID are required.');
      error.name = 'ValidationError';
      throw error;
    }

    const enrollment = await get('SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?', [userId, courseId]);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'No enrollment found for this course.'
      });
    }

    const course = await get('SELECT syllabus FROM courses WHERE id = ?', [courseId]);
    const syllabus = JSON.parse(course.syllabus);
    const totalChapters = syllabus.length;

    let completedChapters = JSON.parse(enrollment.completed_chapters);
    if (!completedChapters.includes(chapterId)) {
      completedChapters.push(chapterId);
    } else {
      // Toggle off if they mark as incomplete
      completedChapters = completedChapters.filter(id => id !== chapterId);
    }

    const newProgress = Math.round((completedChapters.length / totalChapters) * 100);
    const status = newProgress === 100 ? 'completed' : 'active';

    await run(`
      UPDATE enrollments 
      SET progress = ?, completed_chapters = ?, status = ?
      WHERE user_id = ? AND course_id = ?
    `, [newProgress, JSON.stringify(completedChapters), status, userId, courseId]);

    res.status(200).json({
      success: true,
      progress: newProgress,
      completedChapters,
      status
    });
  } catch (err) {
    next(err);
  }
};

const getStudentDashboard = async (req, res, next) => {
  const userId = req.user.id;
  try {
    // 1. Fetch user enrollments with course details
    const enrollments = await query(`
      SELECT e.*, c.title, c.instructor, c.category, c.image_url, c.syllabus 
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = ?
    `, [userId]);

    const parsedEnrollments = enrollments.map(e => ({
      ...e,
      syllabus: JSON.parse(e.syllabus),
      completed_chapters: JSON.parse(e.completed_chapters)
    }));

    // 2. Fetch bookmarks
    const bookmarks = await query(`
      SELECT c.* 
      FROM bookmarks b
      JOIN courses c ON b.course_id = c.id
      WHERE b.user_id = ?
    `, [userId]);

    const parsedBookmarks = bookmarks.map(c => ({
      ...c,
      syllabus: JSON.parse(c.syllabus),
      resources: c.resources ? JSON.parse(c.resources) : []
    }));

    // 3. Compute stats
    const totalCourses = parsedEnrollments.length;
    const completedCourses = parsedEnrollments.filter(e => e.status === 'completed').length;
    const averageProgress = totalCourses > 0 
      ? Math.round(parsedEnrollments.reduce((acc, curr) => acc + curr.progress, 0) / totalCourses) 
      : 0;

    // 4. Get dynamic AI-based Recommendations
    const recommendedCourses = await getPersonalizedRecommendations(userId);

    res.status(200).json({
      success: true,
      stats: {
        totalCourses,
        completedCourses,
        averageProgress,
        studyHours: totalCourses * 4.5 + completedCourses * 5 // Mock calculation of study hours
      },
      enrollments: parsedEnrollments,
      bookmarks: parsedBookmarks,
      recommendations: recommendedCourses
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  purchaseCourse,
  bookmarkCourse,
  getBookmarks,
  addReview,
  updateCourseProgress,
  getStudentDashboard
};
