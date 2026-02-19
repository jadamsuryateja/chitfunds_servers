const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const dropIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const collection = mongoose.connection.collection('clients');

        // List indexes to see what we're dealing with
        const indexes = await collection.indexes();
        console.log('Current Indexes:', indexes);

        const indexExists = indexes.some(idx => idx.name === 'username_1');

        if (indexExists) {
            await collection.dropIndex('username_1');
            console.log('SUCCESS: Dropped index "username_1"');
        } else {
            console.log('INFO: Index "username_1" not found. It might have been already dropped.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

dropIndex();
