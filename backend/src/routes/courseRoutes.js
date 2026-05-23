const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getCourses,
  getCourseById,
  purchaseCourse,
  bookmarkCourse,
  getBookmarks,
  addReview,
  updateCourseProgress,
  getStudentDashboard
} = require('../controllers/courseController');

router.get('/', getCourses);
router.get('/dashboard', verifyToken, getStudentDashboard);
router.get('/bookmarks', verifyToken, getBookmarks);
router.post('/bookmarks', verifyToken, bookmarkCourse);
router.get('/:id', getCourseById);
router.post('/purchase', verifyToken, purchaseCourse);
router.post('/progress', verifyToken, updateCourseProgress);
router.post('/review', verifyToken, addReview);

module.exports = router;
