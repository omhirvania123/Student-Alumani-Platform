const express = require('express');
const router = express.Router();
const { getProfile, postProfile,updateProfile,deleteProfile } = require('../controllers/profileController');
const auth = require('../middleware/auth');

// @route   GET /api/profile/:userId
// @desc    Get user profile
// @access  Private

router.get('/:userId', auth, getProfile);

// @route   PUT /api/profile/:userId
// @desc    Create or update user profile
// @access  Private
router.post('/:userId', auth, postProfile);

router.put('/:userId',auth,updateProfile);

router.delete('/:userId',auth,deleteProfile);

module.exports = router; 