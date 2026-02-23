const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const run = async () => {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db();
        
        const courses = await db.collection('courses').find().toArray();
        console.log('--- COURSES ---');
        console.log('Total:', courses.length);
        courses.forEach(c => {
            console.log(`- ${c.title} | InstructorID: ${c.instructorId} | Approved: ${c.isApproved}`);
        });

        const users = await db.collection('users').find({ role: 'instructor' }).toArray();
        console.log('\n--- INSTRUCTORS ---');
        users.forEach(u => {
            console.log(`- ${u.name} | ID: ${u._id} | Status: ${u.status}`);
        });

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
};

run();
