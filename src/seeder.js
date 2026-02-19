const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

connectDB();

const importData = async () => {
    try {
        await Admin.deleteMany();

        const adminUser = {
            email: 'networld.chp@gmail.com',
            password: 'Abt@yel1',
            role: 'admin',
        };

        const blogAdminUser = {
            email: 'networld.blogs@gmail.com',
            password: 'Abt@yel1',
            role: 'blog-admin',
        };

        await Admin.create([adminUser, blogAdminUser]);

        console.log('Admin Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    // destroyData(); // Not implementing destroy for now
} else {
    importData();
}
