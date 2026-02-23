const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const run = async () => {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db();
        
        // Find 'vidhi' user
        const vidhi = await db.collection('users').findOne({ name: 'vidhi' });
        if (!vidhi) {
            console.log('Vidhi not found');
            return;
        }

        const result = await db.collection('courses').updateMany(
            { title: 'computer' },
            { $set: { instructorId: vidhi._id, isApproved: false } }
        );
        console.log(`Updated ${result.modifiedCount} courses`);

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
};

run();
