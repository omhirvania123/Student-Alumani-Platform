const mongoose = require("mongoose");

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected To MongoDB");
  } catch (error) {
    console.error("❌ Error Connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectToMongoDB;