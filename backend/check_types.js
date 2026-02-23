const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const run = async () => {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db();
        
        const courses = await db.collection('courses').find().toArray();
        console.log('--- DATA TYPES ---');
        courses.forEach(c => {
            console.log(`Course: ${c.title}`);
            console.log(`- _id type: ${typeof c._id} (${c._id instanceof ObjectId ? 'ObjectId' : 'not ObjectId'})`);
            console.log(`- instructorId type: ${typeof c.instructorId} (${c.instructorId instanceof ObjectId ? 'ObjectId' : 'not ObjectId'})`);
        });

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
};

run();
