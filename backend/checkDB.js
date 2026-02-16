const mongoose = require('mongoose');
require('dotenv').config();

const checkDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;

        // Get all collections
        const collections = await db.listCollections().toArray();
        console.log('\n📊 Collections in database:');

        for (const collection of collections) {
            const count = await db.collection(collection.name).countDocuments();
            console.log(`  - ${collection.name}: ${count} documents`);

            // Show sample data (first 3 documents, hiding sensitive fields)
            if (count > 0) {
                const samples = await db.collection(collection.name)
                    .find({})
                    .limit(3)
                    .project({ password: 0 }) // Hide password field
                    .toArray();

                console.log(`    Sample data:`);
                samples.forEach((doc, i) => {
                    console.log(`    ${i + 1}.`, JSON.stringify(doc, null, 2).substring(0, 200) + '...');
                });
            }
        }

        await mongoose.connection.close();
        console.log('\n✅ Database check complete');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
};

checkDatabase();
