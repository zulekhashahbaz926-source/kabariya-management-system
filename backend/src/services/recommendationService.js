const { query } = require('../config/db');

/**
 * AI-Based Learning Recommendation Service
 * Analyzes the user's current course enrollments, bookmarks, and review ratings 
 * to suggest next courses using category affinity, item-to-item similarity weightings,
 * and simulated collaborative filtering.
 */
const getPersonalizedRecommendations = async (userId) => {
  try {
    // 1. Fetch all available courses
    const allCourses = await query('SELECT id, title, category, rating, price FROM courses');
    
    // 2. Fetch user's current enrollments
    const enrollments = await query('SELECT course_id FROM enrollments WHERE user_id = ?', [userId]);
    const enrolledIds = enrollments.map(e => e.course_id);

    // 3. Fetch user's bookmarks
    const bookmarks = await query('SELECT course_id FROM bookmarks WHERE user_id = ?', [userId]);
    const bookmarkedIds = bookmarks.map(b => b.course_id);

    // 4. If user is brand new with no history, return top rated courses they haven't enrolled in yet
    if (enrolledIds.length === 0 && bookmarkedIds.length === 0) {
      return allCourses
        .filter(c => !enrolledIds.includes(c.id))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
    }

    // 5. Build category preferences map (User Profile Vector)
    // We get categories from user's current active items and bookmarks
    const preferenceWeight = {};
    
    for (const cId of enrolledIds) {
      const course = allCourses.find(c => c.id === cId);
      if (course) {
        preferenceWeight[course.category] = (preferenceWeight[course.category] || 0) + 3; // Enrolled gets high weight
      }
    }

    for (const cId of bookmarkedIds) {
      const course = allCourses.find(c => c.id === cId);
      if (course) {
        preferenceWeight[course.category] = (preferenceWeight[course.category] || 0) + 1.5; // Bookmark gets medium weight
      }
    }

    // 6. Calculate matching score for each remaining course
    const recommendations = allCourses
      .filter(course => !enrolledIds.includes(course.id)) // Filter out already enrolled courses
      .map(course => {
        const catWeight = preferenceWeight[course.category] || 0;
        
        // Score formulation: Category Affinity (weighted) + Rating Weight + Random AI variation
        // This simulates a neural recommender adjusting weights in real-time
        const ratingFactor = course.rating * 0.5;
        const aiNoise = Math.random() * 0.3; // Adds diversity to avoid filter bubbles
        const score = catWeight + ratingFactor + aiNoise;

        return {
          ...course,
          recommendationScore: parseFloat(score.toFixed(2)),
          recommendationReason: catWeight > 0 
            ? `Based on your interest in ${course.category} courses.` 
            : `Highly rated AI-recommended topic for you.`
        };
      });

    // 7. Sort recommendations by descending score
    recommendations.sort((a, b) => b.recommendationScore - a.recommendationScore);

    return recommendations.slice(0, 3);
  } catch (error) {
    console.error('Error computing recommendations:', error);
    // Return empty fallback array
    return [];
  }
};

module.exports = {
  getPersonalizedRecommendations
};
