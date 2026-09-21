const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

// Health check endpoint
router.get('/health', memberController.healthCheck);

// Member CRUD endpoints
router.post('/members', memberController.createMember);
router.get('/members', memberController.getAllMembers);
router.get('/members/search', memberController.searchMembers);
router.get('/members/filter', memberController.filterMembers);
router.get('/members/:id', memberController.getMemberById);
router.put('/members/:id', memberController.updateMember);
router.delete('/members/:id', memberController.deleteMember);

// Statistics endpoint
router.get('/stats', memberController.getStats);

module.exports = router;
