import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Profile from "./Profile";

// Dashboard Home Component
const DashboardHome = () => (
  <>
    {/* Hero Section */}
    <section className="w-screen bg-blue-600 text-white text-center py-24 mt-0">
      <h2 className="text-4xl font-bold">Connect. Learn. Grow.</h2>
      <p className="mt-2 text-lg">An intelligent platform to interconnect Alumni & Students.</p>
      <button className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-md font-semibold hover:bg-gray-200">
        Get Started
      </button>
    </section>

    {/* Features Section */}
    <section className="w-screen bg-gray-100 py-12 flex flex-col md:flex-row justify-center gap-6 px-6">
      <div className="bg-white shadow-md p-6 rounded-lg w-full md:w-1/4 text-center">
        <h3 className="text-lg font-semibold text-blue-600">Mentorship</h3>
        <p className="text-gray-600 mt-2">Get career advice from alumni.</p>
      </div>

      <div className="bg-white shadow-md p-6 rounded-lg w-full md:w-1/4 text-center">
        <h3 className="text-lg font-semibold text-blue-600">Jobs & Internships</h3>
        <p className="text-gray-600 mt-2">Find opportunities shared by alumni.</p>
      </div>

      <div className="bg-white shadow-md p-6 rounded-lg w-full md:w-1/4 text-center">
        <h3 className="text-lg font-semibold text-blue-600">Networking</h3>
        <p className="text-gray-600 mt-2">Connect with industry professionals.</p>
      </div>
    </section>

    {/* Testimonials */}
    <section className="p-10 bg-gray-50 w-screen">
      <h2 className="text-3xl font-bold text-center text-blue-600">What Our Users Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 px-6">
        {[
          { name: "John Doe", feedback: "This platform helped me land my first job!" },
          { name: "Jane Smith", feedback: "Amazing mentorship opportunities from alumni." },
        ].map((review, index) => (
          <div key={index} className="p-6 bg-white rounded-xl shadow-md">
            <p className="text-gray-700">"{review.feedback}"</p>
            <h4 className="mt-2 font-semibold text-blue-600">{review.name}</h4>
          </div>
        ))}
      </div>
    </section>

    {/* Footer */}
    <footer className="text-center bg-gray-900 text-white py-6 w-screen mb-0">
      <p>© 2025 AlumniConnect. All rights reserved.</p>
    </footer>
  </>
);

// Settings Component
const Settings = () => (
  <div className="p-6">
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Settings</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
              <span>Email notifications for new messages</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
              <span>Email notifications for event updates</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
              <span>Email notifications for job opportunities</span>
            </label>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
              <span>Make profile visible to other users</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
              <span>Show email address in profile</span>
            </label>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
          Save Settings
        </button>
      </div>
    </div>
  </div>
);

const Dashboard = ({ handleLogout }) => {
  return (
    <div className="w-full min-h-screen bg-gray-100 overflow-hidden mx-0">
      <Navbar handleLogout={handleLogout} />
      <div className="pt-16"> {/* Add padding top to account for fixed navbar */}
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
