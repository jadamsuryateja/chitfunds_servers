const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Category = require('./models/Category');
const State = require('./models/State');

dotenv.config();

const seedCMS = async () => {
    try {
        await connectDB();
        console.log('DB Connected');

        // 1. Seed Categories
        const categories = [
            { name: 'National', description: 'National News' },
            { name: 'World', description: 'International News' },
            { name: 'Crime', description: 'Crime Reports' },
            { name: 'Village News', description: 'Local Village Stories' },
            { name: 'Sports', description: 'Sports Updates' },
            { name: 'Politics', description: 'Political News' },
            { name: 'Entertainment', description: 'Movies and Arts' },
            { name: 'Business', description: 'Business and Economy' }
        ];

        for (const cat of categories) {
            const exists = await Category.findOne({ name: cat.name });
            if (!exists) {
                // Generate simple slug
                const slug = cat.name.toLowerCase().replace(/ /g, '-');
                await Category.create({ ...cat, slug, isActive: true });
                console.log(`Created Category: ${cat.name}`);
            } else {
                console.log(`Category exists: ${cat.name}`);
            }
        }

        // 2. Seed States
        const states = [
            { name: 'Telangana', code: 'TS', isActive: true },
            { name: 'Andhra Pradesh', code: 'AP', isActive: true },
            { name: 'Karnataka', code: 'KA', isActive: true },
            { name: 'Tamil Nadu', code: 'TN', isActive: true }
        ];

        for (const state of states) {
            const exists = await State.findOne({ name: state.name });
            if (!exists) {
                await State.create(state);
                console.log(`Created State: ${state.name}`);
            } else {
                console.log(`State exists: ${state.name}`);
            }
        }

        console.log('Seeding Completed');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedCMS();
