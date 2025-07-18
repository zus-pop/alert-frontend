const express = require('express');
const router = express.Router();
const employerRequestController = require('../controllers/employerRequestController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// User gửi yêu cầu
router.post('/', auth, employerRequestController.createRequest);
// User lấy lịch sử yêu cầu
router.get('/history', auth, employerRequestController.getUserHistory);
// Admin lấy danh sách yêu cầu
router.get('/', auth, isAdmin, employerRequestController.getAllRequests);
// Admin duyệt yêu cầu
router.patch('/:id/approve', auth, isAdmin, employerRequestController.approveRequest);
// Admin từ chối yêu cầu
router.patch('/:id/reject', auth, isAdmin, employerRequestController.rejectRequest);

module.exports = router; 