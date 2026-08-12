import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../UserContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Camera, Briefcase, Calendar, Mail, Linkedin, MapPin, Edit2, X } from 'lucide-react';

// Predefined skills list for suggestions
const SKILLS_LIST = [
  // Programming Languages
  'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Go', 'Rust',
  'TypeScript', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Perl', 'Shell Scripting', 'PowerShell',
  'Assembly', 'Dart', 'Groovy', 'Lua', 'Haskell', 'Objective-C',

  // Web Technologies
  'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot',
  'HTML5', 'CSS3', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Bootstrap', 'Material UI',
  'jQuery', 'Redux', 'GraphQL', 'REST APIs', 'WebSocket', 'Sass/SCSS', 'Webpack', 'Babel',
  'Vite', 'Svelte', 'Laravel', 'ASP.NET', 'Ruby on Rails', 'WordPress', 'Drupal',
  'Three.js', 'WebGL', 'Socket.io', 'PWA', 'Web Components', 'Storybook', 'Web Development',

  // Databases & Data
  'MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Oracle', 'SQL Server', 'Firebase',
  'Elasticsearch', 'Cassandra', 'DynamoDB', 'Neo4j', 'MariaDB', 'SQLite', 'Supabase',
  'Data Modeling', 'Database Design', 'SQL', 'NoSQL', 'Data Migration', 'ETL',
  'Data Warehousing', 'Data Lake', 'Big Data', 'Apache Kafka', 'Apache Spark',

  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub Actions',
  'Terraform', 'Ansible', 'Puppet', 'Chef', 'CircleCI', 'Travis CI', 'GitLab CI',
  'Cloud Architecture', 'Microservices', 'Serverless', 'Lambda Functions', 'ECS', 'EKS',
  'Load Balancing', 'Auto Scaling', 'Infrastructure as Code', 'Site Reliability Engineering',
  'DevSecOps', 'Monitoring', 'Logging', 'Prometheus', 'Grafana', 'ELK Stack',

  // Mobile Development
  'React Native', 'Flutter', 'iOS Development', 'Android Development', 'Xamarin',
  'Mobile UI Design', 'App Store Optimization', 'Push Notifications', 'Mobile Security',
  'Responsive Design', 'Cross-platform Development', 'Native Development', 'SwiftUI',
  'Jetpack Compose', 'Mobile Testing', 'App Performance', 'Mobile Analytics',

  // AI & ML
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Natural Language Processing',
  'Computer Vision', 'Neural Networks', 'Reinforcement Learning', 'Data Science',
  'Scikit-learn', 'OpenCV', 'YOLO', 'GPT', 'BERT', 'Transformers', 'Feature Engineering',
  'Model Deployment', 'MLOps', 'AI Ethics', 'Statistical Analysis', 'Pandas', 'NumPy',

  // Testing & Quality
  'Unit Testing', 'Integration Testing', 'E2E Testing', 'Test Automation', 'Jest',
  'Cypress', 'Selenium', 'JUnit', 'TestNG', 'Mocha', 'Chai', 'Robot Framework',
  'Performance Testing', 'Load Testing', 'Security Testing', 'API Testing', 'TDD', 'BDD',

  // Project Management & Tools
  'Agile', 'Scrum', 'Kanban', 'JIRA', 'Confluence', 'Trello', 'Asana', 'MS Project',
  'Risk Management', 'Stakeholder Management', 'Project Planning', 'Team Leadership',
  'Budgeting', 'Resource Allocation', 'Quality Management', 'Change Management',

  // Design & UI/UX
  'Figma', 'Adobe XD', 'Sketch', 'InVision', 'Photoshop', 'Illustrator',
  'UI Design', 'UX Design', 'Wireframing', 'Prototyping', 'User Research',
  'Usability Testing', 'Information Architecture', 'Design Systems', 'Design Thinking',

  // Security
  'Cybersecurity', 'Network Security', 'Web Security', 'Penetration Testing',
  'Security Auditing', 'Encryption', 'Authentication', 'Authorization', 'OAuth',
  'JWT', 'SSL/TLS', 'Firewall Configuration', 'Security Best Practices', 'OWASP',

  // Soft Skills
  'Problem Solving', 'Critical Thinking', 'Communication', 'Team Collaboration',
  'Time Management', 'Leadership', 'Adaptability', 'Creativity', 'Analytical Skills',
  'Presentation Skills', 'Technical Writing', 'Mentoring', 'Conflict Resolution'
];

// Predefined interests list for suggestions
const INTERESTS_LIST = [
  // Technology & Innovation
  'Artificial Intelligence', 'Blockchain', 'Cybersecurity', 'Data Science', 'Internet of Things',
  'Virtual Reality', 'Augmented Reality', 'Robotics', 'Space Technology', 'Quantum Computing',
  'Edge Computing', '5G Technology', 'Digital Transformation', 'Smart Cities', 'Autonomous Vehicles',
  'Bioinformatics', 'Cloud Computing', 'DevOps Culture', 'Serverless Architecture',

  // Business & Career
  'Entrepreneurship', 'Startups', 'Digital Marketing', 'E-commerce', 'Business Analytics',
  'Innovation Management', 'Leadership Development', 'Project Management', 'Product Management',
  'Strategic Planning', 'Business Development', 'Venture Capital', 'Market Research',
  'Financial Technology', 'Corporate Strategy', 'Business Intelligence', 'Risk Management',
  'Investment Banking', 'Management Consulting', 'Sales Strategy', 'Brand Management',

  // Industry Specific
  'Healthcare Technology', 'EdTech', 'FinTech', 'AgriTech', 'CleanTech', 'BioTech',
  'Aerospace', 'Automotive Industry', 'Renewable Energy', 'Telecommunications',
  'Manufacturing', 'Retail Innovation', 'Supply Chain', 'Logistics', 'Real Estate',
  'Media & Entertainment', 'Gaming Industry', 'Fashion Technology', 'Food Technology',

  // Professional Development
  'Career Growth', 'Professional Networking', 'Leadership Skills', 'Public Speaking',
  'Personal Branding', 'Workplace Culture', 'Remote Work', 'Work-Life Balance',
  'Continuous Learning', 'Mentorship', 'Team Building', 'Change Management',
  'Digital Skills', 'Emotional Intelligence', 'Cross-cultural Communication',

  // Research & Innovation
  'Scientific Research', 'R&D', 'Innovation Strategy', 'Patent Development',
  'Academic Research', 'Market Innovation', 'Product Innovation', 'Design Thinking',
  'Emerging Technologies', 'Technology Transfer', 'Research Methodology',

  // Social Impact & Sustainability
  'Social Entrepreneurship', 'Environmental Sustainability', 'Corporate Social Responsibility',
  'Green Technology', 'Climate Action', 'Circular Economy', 'Social Innovation',
  'Impact Investing', 'Sustainable Development', 'Renewable Resources', 'Ethics in Technology',

  // Creative & Design
  'UI/UX Design', 'Product Design', 'Digital Art', 'Creative Technology', 'Design Thinking',
  'User Research', 'Interactive Design', 'Motion Design', 'Brand Design', 'Design Systems',
  'Creative Strategy', 'Experience Design', 'Visual Communication',

  // Future of Work
  'Digital Workplace', 'Future of Work', 'Workplace Innovation', 'Remote Teams',
  'Digital Collaboration', 'Organizational Development', 'Talent Management',
  'HR Technology', 'Learning & Development', 'Workforce Analytics',

  // Emerging Fields
  'Space Exploration', 'Nanotechnology', 'Biotechnology', 'Genetic Engineering',
  'Smart Materials', 'Brain-Computer Interface', 'Quantum Technology', 'Synthetic Biology',
  'Advanced Materials', 'Energy Storage', 'Precision Medicine',

  // Personal Growth
  'Skill Development', 'Personal Productivity', 'Goal Setting', 'Time Management',
  'Strategic Thinking', 'Decision Making', 'Problem Solving', 'Creative Thinking',
  'Innovation Mindset', 'Learning Agility', 'Adaptability', 'Resilience'
];

const Profile = () => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [showInterestsDropdown, setShowInterestsDropdown] = useState(false);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [filteredInterests, setFilteredInterests] = useState([]);
  const skillsInputRef = useRef(null);
  const interestsInputRef = useRef(null);
  const skillsDropdownRef = useRef(null);
  const interestsDropdownRef = useRef(null);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    username: '',
    graduationYear: '',
    currentPosition: '',
    company: '',
    linkedinProfile: '',
    bio: '',
    skills: [],
    interests: []
  });

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(-1);
  const [selectedInterestIndex, setSelectedInterestIndex] = useState(-1);

  useEffect(() => {
    if (user) {
      // Initialize with user data
      setProfileData(prevData => ({
        ...prevData,
        fullName: user.name || '',
        email: user.email || '',
        username: user.username || ''
      }));
      // Fetch additional profile data
      fetchProfileData();
    }
  }, [user]);

  // Update click outside listener to handle both dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle skills dropdown
      if (skillsDropdownRef.current && !skillsDropdownRef.current.contains(event.target) &&
          skillsInputRef.current && !skillsInputRef.current.contains(event.target)) {
        setShowSkillsDropdown(false);
      }
      // Handle interests dropdown
      if (interestsDropdownRef.current && !interestsDropdownRef.current.contains(event.target) &&
          interestsInputRef.current && !interestsInputRef.current.contains(event.target)) {
        setShowInterestsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/profile/${user.email}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProfileData(prev => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 404) {
        // No profile found is okay for new users
        return;
      }
      setMessage({ 
        text: error.response?.data?.message || 'Error fetching profile data', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter skills based on input
  const handleSkillInputChange = (e) => {
    const value = e.target.value;
    setNewSkill(value);
    setSelectedSkillIndex(-1); // Reset selection when input changes
    
    if (value.trim()) {
      const searchTerm = value.toLowerCase();
      // Only show items that start with the search term
      const startsWithTerm = SKILLS_LIST.filter(skill => 
        skill.toLowerCase().startsWith(searchTerm)
      );
      setFilteredSkills(startsWithTerm);
      setShowSkillsDropdown(true);
    } else {
      setShowSkillsDropdown(false);
    }
  };

  // Handle keyboard navigation for skills
  const handleSkillKeyDown = (e) => {
    if (!showSkillsDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSkillIndex(prev => {
          const nextIndex = prev < filteredSkills.length - 1 ? prev + 1 : prev;
          // Scroll the item into view
          const item = document.querySelector(`#skill-item-${nextIndex}`);
          item?.scrollIntoView({ block: 'nearest' });
          return nextIndex;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSkillIndex(prev => {
          const nextIndex = prev > 0 ? prev - 1 : -1;
          // Scroll the item into view
          const item = document.querySelector(`#skill-item-${nextIndex}`);
          item?.scrollIntoView({ block: 'nearest' });
          return nextIndex;
        });
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSkillIndex >= 0) {
          handleSkillSelect(filteredSkills[selectedSkillIndex]);
        }
        setShowSkillsDropdown(false);
        setSelectedSkillIndex(-1);
        break;
      case 'Escape':
        setShowSkillsDropdown(false);
        setSelectedSkillIndex(-1);
        break;
    }
  };

  // Add skill from dropdown
  const handleSkillSelect = (skill) => {
    if (!profileData.skills.includes(skill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
    setNewSkill('');
    setShowSkillsDropdown(false);
  };

  const removeSkill = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Filter interests based on input
  const handleInterestInputChange = (e) => {
    const value = e.target.value;
    setNewInterest(value);
    setSelectedInterestIndex(-1); // Reset selection when input changes
    
    if (value.trim()) {
      const searchTerm = value.toLowerCase();
      // Only show items that start with the search term
      const startsWithTerm = INTERESTS_LIST.filter(interest => 
        interest.toLowerCase().startsWith(searchTerm)
      );
      setFilteredInterests(startsWithTerm);
      setShowInterestsDropdown(true);
    } else {
      setShowInterestsDropdown(false);
    }
  };

  // Handle keyboard navigation for interests
  const handleInterestKeyDown = (e) => {
    if (!showInterestsDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedInterestIndex(prev => {
          const nextIndex = prev < filteredInterests.length - 1 ? prev + 1 : prev;
          // Scroll the item into view
          const item = document.querySelector(`#interest-item-${nextIndex}`);
          item?.scrollIntoView({ block: 'nearest' });
          return nextIndex;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedInterestIndex(prev => {
          const nextIndex = prev > 0 ? prev - 1 : -1;
          // Scroll the item into view
          const item = document.querySelector(`#interest-item-${nextIndex}`);
          item?.scrollIntoView({ block: 'nearest' });
          return nextIndex;
        });
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedInterestIndex >= 0) {
          handleInterestSelect(filteredInterests[selectedInterestIndex]);
        }
        setShowInterestsDropdown(false);
        setSelectedInterestIndex(-1);
        break;
      case 'Escape':
        setShowInterestsDropdown(false);
        setSelectedInterestIndex(-1);
        break;
    }
  };

  // Add interest from dropdown
  const handleInterestSelect = (interest) => {
    if (!profileData.interests.includes(interest)) {
      setProfileData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
    setNewInterest('');
    setShowInterestsDropdown(false);
  };

  const removeInterest = (interestToRemove) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  const validateForm = () => {
    const requiredFields = ['fullName', 'username'];
    const missingFields = requiredFields.filter(field => !profileData[field]);
    
    if (missingFields.length > 0) {
      setMessage({
        text: `Please fill in the following required fields: ${missingFields.join(', ')}`,
        type: 'error'
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const profilePayload = {
      user_id: user._id,
      username: profileData.username,
      fullName: profileData.fullName,
      email: profileData.email,
      graduationYear: profileData.graduationYear,
      currentPosition: profileData.currentPosition,
      company: profileData.company,
      linkedinProfile: profileData.linkedinProfile,
      bio: profileData.bio,
      skills: profileData.skills,
      interests: profileData.interests
    };

    try {
      setLoading(true);
      let response;
      
      // Check if we're creating or updating
      if (profileData._id) {
        response = await axios.put(
          `http://localhost:3000/api/profile/${profileData.email}`,
          profilePayload,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
      } else {
        response = await axios.post(
          'http://localhost:3000/api/profile',
          profilePayload,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
      }
      
      setProfileData(response.data);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Error updating profile', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
          >
            My Profile
          </motion.h1>
          <p className="text-gray-600 mt-2">Showcase your professional journey</p>
        </div>
        
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 mb-6 rounded-lg shadow-lg flex items-center justify-between
              ${message.type === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' : 
              'bg-red-50 text-red-800 border-l-4 border-red-500'}`}
          >
            <span>{message.text}</span>
            <button 
              onClick={() => setMessage({ text: '', type: '' })}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          </motion.div>
      )}
      
      {loading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      ) : (
        <>
          {!isEditing ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                  <div className="absolute -bottom-16 left-8">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center">
                      <span className="text-4xl font-bold text-gray-600">
                        {profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : '?'}
                      </span>
                    </div>
                  </div>
                <button
                  onClick={() => setIsEditing(true)}
                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all flex items-center gap-2"
                >
                    <Edit2 size={18} />
                  Edit Profile
                </button>
              </div>
              
                <div className="pt-20 px-8 pb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                      <h2 className="text-2xl font-bold text-gray-800">{profileData.fullName || '-'}</h2>
                      <p className="text-gray-600 mt-1">@{profileData.username || '-'}</p>
                      
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center text-gray-600">
                          <Mail size={18} className="mr-2" />
                          {profileData.email}
                </div>
                        {profileData.graduationYear && (
                          <div className="flex items-center text-gray-600">
                            <Calendar size={18} className="mr-2" />
                            Class of {profileData.graduationYear}
                </div>
                        )}
                        {profileData.currentPosition && (
                          <div className="flex items-center text-gray-600">
                            <Briefcase size={18} className="mr-2" />
                            {profileData.currentPosition} {profileData.company && `at ${profileData.company}`}
                </div>
                        )}
                        {profileData.linkedinProfile && (
                      <a 
                        href={profileData.linkedinProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-700"
                      >
                            <Linkedin size={18} className="mr-2" />
                            LinkedIn Profile
                      </a>
                        )}
                </div>
              </div>
              
                    <div>
                      {profileData.bio && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-700 mb-2">About</h3>
                          <p className="text-gray-600">{profileData.bio}</p>
                        </div>
                      )}
                    </div>
              </div>
              
                  <div className="mt-8">
                    <h3 className="font-semibold text-gray-700 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                  {profileData.skills && profileData.skills.length > 0 ? (
                    profileData.skills.map((skill, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                          >
                        {skill}
                          </motion.span>
                    ))
                      ) : <p className="text-gray-500">No skills added yet</p>}
                </div>
              </div>
              
              <div className="mt-6">
                    <h3 className="font-semibold text-gray-700 mb-3">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                  {profileData.interests && profileData.interests.length > 0 ? (
                    profileData.interests.map((interest, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                          >
                        {interest}
                          </motion.span>
                    ))
                      ) : <p className="text-gray-500">No interests added yet</p>}
                </div>
              </div>
            </div>
              </motion.div>
            ) : (
              <motion.form 
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>
                <div>
                    <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>
                <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                  />
                  <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <div>
                    <label htmlFor="graduationYear" className="block text-gray-700 font-medium mb-2">
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    id="graduationYear"
                    name="graduationYear"
                    value={profileData.graduationYear}
                    onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="e.g. 2023"
                  />
                </div>
                <div>
                    <label htmlFor="currentPosition" className="block text-gray-700 font-medium mb-2">
                    Current Position
                  </label>
                  <input
                    type="text"
                    id="currentPosition"
                    name="currentPosition"
                    value={profileData.currentPosition}
                    onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="e.g. Software Engineer"
                  />
                </div>
                <div>
                    <label htmlFor="company" className="block text-gray-700 font-medium mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={profileData.company}
                    onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="e.g. Tech Company Inc."
                  />
                </div>
                <div>
                    <label htmlFor="linkedinProfile" className="block text-gray-700 font-medium mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    id="linkedinProfile"
                    name="linkedinProfile"
                    value={profileData.linkedinProfile}
                    onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                  <div className="col-span-2">
                    <label htmlFor="bio" className="block text-gray-700 font-medium mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>
              
                  <div className="col-span-2">
                    <label htmlFor="skills" className="block text-gray-700 font-medium mb-2">
                      Skills
                </label>
                    <div className="space-y-2 relative">
                <input
                        ref={skillsInputRef}
                  type="text"
                  id="skills"
                        value={newSkill}
                        onChange={handleSkillInputChange}
                        onKeyDown={handleSkillKeyDown}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="Type a skill and press Enter"
                      />
                      {showSkillsDropdown && filteredSkills.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          ref={skillsDropdownRef}
                          className="absolute z-10 w-full bg-white mt-1 border border-gray-200 rounded-lg shadow-xl"
                        >
                          <div className="max-h-60 overflow-y-auto">
                            {filteredSkills.map((skill, index) => (
                              <div
                                key={index}
                                id={`skill-item-${index}`}
                                className={`px-4 py-2 cursor-pointer transition-all ${
                                  index === selectedSkillIndex
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                                }`}
                                onClick={() => handleSkillSelect(skill)}
                              >
                                {skill}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {profileData.skills.map((skill, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-2 text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
              </div>
              
                  <div className="col-span-2">
                    <label htmlFor="interests" className="block text-gray-700 font-medium mb-2">
                      Interests
                </label>
                    <div className="space-y-2 relative">
                <input
                        ref={interestsInputRef}
                  type="text"
                  id="interests"
                        value={newInterest}
                        onChange={handleInterestInputChange}
                        onKeyDown={handleInterestKeyDown}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="Type an interest and press Enter"
                      />
                      {showInterestsDropdown && filteredInterests.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          ref={interestsDropdownRef}
                          className="absolute z-10 w-full bg-white mt-1 border border-gray-200 rounded-lg shadow-xl"
                        >
                          <div className="max-h-60 overflow-y-auto">
                            {filteredInterests.map((interest, index) => (
                              <div
                                key={index}
                                id={`interest-item-${index}`}
                                className={`px-4 py-2 cursor-pointer transition-all ${
                                  index === selectedInterestIndex
                                    ? 'bg-green-50 text-green-700'
                                    : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                                }`}
                                onClick={() => handleInterestSelect(interest)}
                              >
                                {interest}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {profileData.interests.map((interest, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full"
                          >
                            <span>{interest}</span>
                            <button
                              type="button"
                              onClick={() => removeInterest(interest)}
                              className="ml-2 text-green-600 hover:text-green-800 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
              </div>
              
                <motion.div 
                  className="mt-8 flex justify-end gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-8 py-3 rounded-lg font-medium transition-all duration-200 border border-gray-300 hover:border-gray-400 bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow flex items-center gap-2"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                <button
                  type="submit"
                    className="px-8 py-3 rounded-lg font-medium transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={loading}
                >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>Save Profile</>
                    )}
                </button>
                </motion.div>
              </motion.form>
          )}
        </>
      )}
    </div>
    </motion.div>
  );
};

export default Profile;