const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const run = async () => {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db();
        
        const user = await db.collection('users').findOne({ _id: new ObjectId("6996a3e4a3e37e545bf8a614") });
        if (user) {
            console.log('User found:', user.name, user.email, user.role);
        } else {
            // Check if it's stored as a string _id (unlikely but possible in some setups)
            const userStr = await db.collection('users').findOne({ _id: "6996a3e4a3e37e545bf8a614" });
            if (userStr) {
                console.log('User found (string ID):', userStr.name, userStr.email, userStr.role);
            } else {
                console.log('User not found');
            }
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
};

run();
