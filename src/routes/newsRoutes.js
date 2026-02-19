const express = require('express');
const router = express.Router();
const {
    getNews,
    getNewsBySlug,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
    getDashboardStats,
    getAdminNews
} = require('../controllers/newsController');

const {
    getStates,
    createState,
    updateState,
    deleteState,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getDistricts,
    createDistrict,
    updateDistrict,
    deleteDistrict
} = require('../controllers/cmsController');

const { protect, admin } = require('../middleware/auth');

// Public News Routes
router.route('/').get(getNews).post(protect, admin, createNews);
router.route('/slug/:slug').get(getNewsBySlug); // Get single news by slug
router.route('/:id').get(getNewsById).put(protect, admin, updateNews).delete(protect, admin, deleteNews);

// Admin Dashboard Stats
router.route('/stats/dashboard').get(protect, admin, getDashboardStats);
router.route('/cms/all').get(protect, admin, getAdminNews); // Validated Admin Route

// CMS Routes (States & Categories) - Public GET, Protected Write
router.route('/cms/states').get(getStates).post(protect, admin, createState);
router.route('/cms/states/:id').put(protect, admin, updateState).delete(protect, admin, deleteState);

router.route('/cms/categories').get(getCategories).post(protect, admin, createCategory);
router.route('/cms/categories/:id').put(protect, admin, updateCategory).delete(protect, admin, deleteCategory);

router.route('/cms/districts').get(getDistricts).post(protect, admin, createDistrict);
router.route('/cms/districts/:id').put(protect, admin, updateDistrict).delete(protect, admin, deleteDistrict);

module.exports = router;
