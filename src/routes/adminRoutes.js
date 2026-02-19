const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
    registerClient,
    getClients,
    updateFinancials,
    toggleClientStatus,
    deleteClient,
    updateClient,
    uploadClientDocument,
    deleteClientDocument
} = require('../controllers/adminController');

router.route('/clients')
    .post(protect, admin, registerClient)
    .get(protect, admin, getClients);

router.route('/clients/:id')
    .delete(protect, admin, deleteClient)
    .put(protect, admin, upload.fields([
        { name: 'profileImage', maxCount: 1 },
        { name: 'aadhaarImage', maxCount: 1 }
    ]), updateClient);

router.route('/clients/:id/documents')
    .post(protect, admin, upload.single('document'), uploadClientDocument);

router.route('/clients/:id/documents/:docId')
    .delete(protect, admin, deleteClientDocument);

router.route('/clients/:id/financials')
    .put(protect, admin, updateFinancials);

router.route('/clients/:id/status')
    .put(protect, admin, toggleClientStatus);

module.exports = router;
