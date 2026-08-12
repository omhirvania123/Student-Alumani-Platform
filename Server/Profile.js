const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  fullName:{
    type: String,
    required: true,
    default: function () {
      return this.username; // Use a function to reference another field
    }
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  graduationYear: {
    type: String,
    default: ''
  },
  currentPosition: {
    type: String,
    default: ''
  },
  company: {
    type: String,
    default: ''
  },
  linkedinProfile: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  skills: [{
    type: String
  }],
  interests: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema); 