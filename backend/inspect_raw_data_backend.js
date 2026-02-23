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
        console.log('--- RAW COURSES ---');
        courses.forEach(c => {
            console.log(JSON.stringify(c, null, 2));
        });

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
};

run();
