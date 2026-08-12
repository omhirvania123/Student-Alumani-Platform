const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password_hash: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const auth = mongoose.model('Auth', AuthSchema);

module.exports = auth;