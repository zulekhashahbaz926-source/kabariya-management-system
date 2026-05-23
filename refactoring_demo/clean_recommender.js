/**
 * REFACTORED CLEAN RECOMMENDER CODE
 * Demonstrates: SOLID Principles, Async/Await, Array Map/Filter/Reduce pipelines,
 * separation of concerns, connection reuse, and proper exception handling.
 */

const { query } = require('../backend/src/config/db');

/**
 * Fetch category preferences maps based on enrolled & bookmarked course categories.
 */
const buildPreferenceMap = (allCourses, enrolledIds, bookmarkedIds) => {
  const preferences = {};

  const addWeight = (courseId, weight) => {
    const course = allCourses.find(c => c.id === courseId);
    if (course) {
      preferences[course.category] = (preferences[course.category] || 0) + weight;
    }
  };

  enrolledIds.forEach(id => addWeight(id, 3.0));     // Enrollment weight
  bookmarkedIds.forEach(id => addWeight(id, 1.5));   // Bookmark weight

  return preferences;
};

/**
 * Score a single course based on user preferences and quality ratings.
 */
const calculateCourseScore = (course, preferences) => {
  const categoryWeight = preferences[course.category] || 0;
  const ratingFactor = course.rating * 0.5;
  const aiNoiseFactor = Math.random() * 0.3; // Introduce recommendation diversity

  const score = categoryWeight + ratingFactor + aiNoiseFactor;

  return {
    id: course.id,
    title: course.title,
    category: course.category,
    rating: course.rating,
    price: course.price,
    recommendationScore: parseFloat(score.toFixed(2)),
    recommendationReason: categoryWeight > 0
      ? `Based on your interest in ${course.category} courses.`
      : `Highly rated AI-recommended topic for you.`
  };
};

/**
 * Retrieves personalized course recommendations for a user.
 * @param {number} userId - The target student user ID.
 * @returns {Promise<Array>} - Top 3 recommended courses.
 */
const getRecommendationsClean = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required to calculate recommendations.');
  }

  // 1. Concurrent fetching of user interactions
  const [allCourses, enrollments, bookmarks] = await Promise.all([
    query('SELECT id, title, category, rating, price FROM courses'),
    query('SELECT course_id FROM enrollments WHERE user_id = ?', [userId]),
    query('SELECT course_id FROM bookmarks WHERE user_id = ?', [userId])
  ]);

  const enrolledIds = enrollments.map(e => e.course_id);
  const bookmarkedIds = bookmarks.map(b => b.course_id);

  // 2. Filter out already purchased courses
  const eligibleCourses = allCourses.filter(course => !enrolledIds.includes(course.id));

  // 3. Compute preference profile
  const preferences = buildPreferenceMap(allCourses, enrolledIds, bookmarkedIds);

  // 4. Score and sort candidates
  return eligibleCourses
    .map(course => calculateCourseScore(course, preferences))
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 3);
};

module.exports = {
  getRecommendationsClean
};
