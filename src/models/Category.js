const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    type: {
        type: String,
        enum: ['news', 'general'],
        default: 'news'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Middleware to create slug from name
categorySchema.pre('save', function (next) {
    if (!this.isModified('name')) {
        next();
        return;
    }
    this.slug = slugify(this.name, { lower: true });
    next();
});

module.exports = mongoose.model('Category', categorySchema);
