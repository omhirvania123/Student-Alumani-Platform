const Profile = require('../models/Profile');

// Get profile
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ email: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create or update profile
const postProfile = async (req, res) => {
  try {
    // Check if profile already exists
    const existingProfile = await Profile.findOne({ user_id: req.body.user_id });
    
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists for this user' });
    }
    
    // Create new profile
    const newProfile = new Profile({
      user_id: req.body.user_id,
      username: req.body.username,
      fullName: req.body.fullName,
      email: req.body.email,
      graduationYear: req.body.graduationYear || '',
      currentPosition: req.body.currentPosition || '',
      company: req.body.company || '',
      linkedinProfile: req.body.linkedinProfile || '',
      bio: req.body.bio || '',
      skills: req.body.skills || [],
      interests: req.body.interests || []
    });
    
    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ email: req.params.userId });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    // Update profile fields
    profile.username = req.body.username;
    profile.fullName = req.body.fullName;
    profile.email = req.body.email;
    profile.graduationYear = req.body.graduationYear || '';
    profile.currentPosition = req.body.currentPosition || '';
    profile.company = req.body.company || '';
    profile.linkedinProfile = req.body.linkedinProfile || '';
    profile.bio = req.body.bio || '';
    profile.skills = req.body.skills || [];
    profile.interests = req.body.interests || [];
    
    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    await profile.deleteOne();
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  postProfile,
  updateProfile,
  deleteProfile
}; 