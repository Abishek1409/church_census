const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { authenticateToken, checkRegionAccess } = require('../middleware/auth');

// Health check endpoint (public - no auth required)
router.get('/health', memberController.healthCheck);

// Test endpoint to verify routing works
router.get('/test-no-auth', (req, res) => {
  res.json({
    success: true,
    message: 'Routing works - no auth required',
    reqUserExists: !!req.user
  });
});

// Test endpoint WITH auth middleware
router.get('/test-with-auth', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Auth middleware works',
    user: req.user
  });
});

// Test endpoint WITH auth + region middleware
router.get('/test-full-chain', authenticateToken, checkRegionAccess, (req, res) => {
  res.json({
    success: true,
    message: 'Full middleware chain works',
    user: req.user,
    userRegions: req.userRegions
  });
});

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
