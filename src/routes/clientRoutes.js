const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
    getClientProfile,
    updateClientProfile,
    uploadMyDocument,
    deleteMyDocument
} = require('../controllers/clientController');

router.route('/profile')
    .get(protect, getClientProfile)
    .put(protect, upload.fields([
        { name: 'aadhaarImage', maxCount: 1 },
        { name: 'profileImage', maxCount: 1 }
    ]), updateClientProfile);

router.route('/profile/documents')
    .post(protect, upload.single('document'), uploadMyDocument);

router.route('/profile/documents/:docId')
    .delete(protect, deleteMyDocument);

module.exports = router;
