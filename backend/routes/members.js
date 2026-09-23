const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { authenticateToken, checkRegionAccess } = require('../middleware/auth');

// Health check endpoint (public - no auth required)
router.get('/health', memberController.healthCheck);

// Member CRUD endpoints (all protected with authentication and region access)
router.post('/members', authenticateToken, checkRegionAccess, memberController.createMember);
router.get('/members', authenticateToken, checkRegionAccess, memberController.getAllMembers);
router.get('/members/search', authenticateToken, checkRegionAccess, memberController.searchMembers);
router.get('/members/filter', authenticateToken, checkRegionAccess, memberController.filterMembers);
router.get('/members/:id', authenticateToken, checkRegionAccess, memberController.getMemberById);
router.put('/members/:id', authenticateToken, checkRegionAccess, memberController.updateMember);
router.delete('/members/:id', authenticateToken, checkRegionAccess, memberController.deleteMember);

// Statistics endpoint (protected with authentication and region access)
router.get('/stats', authenticateToken, checkRegionAccess, memberController.getStats);

module.exports = router;
