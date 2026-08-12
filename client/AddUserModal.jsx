import React, { useState } from 'react';
import { X, User, Mail, Lock, UserPlus } from 'lucide-react';

const AddUserModal = ({ isOpen, onClose, onAddUser }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onAddUser({ ...formData, isActive: true });
            setFormData({
                username: '',
                email: '',
                password: ''
            });
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop with blur effect */}
            <div 
                className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fadeIn">
                <div 
                    className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 hover:shadow-3xl border border-white/20"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="relative p-8">
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 transition-all duration-200 group"
                        >
                            <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
                        </button>

                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="h-20 w-20 bg-gradient-to-tr from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/20 transform hover:rotate-6 transition-transform duration-200">
                                <UserPlus className="h-10 w-10 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Add New User</h2>
                            <p className="text-gray-500 mt-2">Create a new user account</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Username"
                                    required
                                    className="pl-12 pr-4 py-3.5 w-full bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 outline-none placeholder:text-gray-400 hover:bg-white"
                                />
                            </div>

                            {/* Email */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email Address"
                                    required
                                    className="pl-12 pr-4 py-3.5 w-full bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 outline-none placeholder:text-gray-400 hover:bg-white"
                                />
                            </div>

                            {/* Password */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    required
                                    minLength={8}
                                    className="pl-12 pr-4 py-3.5 w-full bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 outline-none placeholder:text-gray-400 hover:bg-white"
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl animate-shake">
                                    <p className="text-red-700 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all duration-200 font-medium shadow-xl hover:shadow-blue-500/30 active:scale-95"
                            >
                                Create User
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddUserModal; 