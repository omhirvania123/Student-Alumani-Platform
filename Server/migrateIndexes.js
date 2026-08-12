const mongoose = require('mongoose');
require('dotenv').config();

async function migrateIndexes() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Connected to MongoDB");

        const db = mongoose.connection;
        const profilesCollection = db.collection('profiles');

        // Drop the old user_id index
        try {
            await profilesCollection.dropIndex('user_id_1');
            console.log("✅ Successfully dropped old user_id index");
        } catch (error) {
            console.log("Note: Old index might not exist:", error.message);
        }

        // Create new index on user field
        await profilesCollection.createIndex({ user: 1 }, { unique: true });
        console.log("✅ Successfully created new user index");

        console.log("✅ Migration completed successfully");
    } catch (error) {
        console.error("❌ Error during migration:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

migrateIndexes();