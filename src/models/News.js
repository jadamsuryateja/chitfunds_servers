const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        trim: true,
        maxLength: 500
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true // Main image
    },
    bannerImage: {
        type: String // Optional banner image for hero section
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State',
        required: false
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District',
        required: false
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    isTopStory: {
        type: Boolean,
        default: false
    },
    isTrending: {
        type: Boolean,
        default: false
    },
    isBanner: {
        type: Boolean,
        default: false
    },
    views: {
        type: Number,
        default: 0
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    publishedAt: {
        type: Date
    }
}, { timestamps: true });

const slugify = require('slugify');

// Middleware to create slug from title
newsSchema.pre('save', function (next) {
    if (!this.isModified('title')) {
        next();
        return;
    }
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now();
    next();
});

// Indexes for fast querying
newsSchema.index({ status: 1, createdAt: -1 });
newsSchema.index({ status: 1, state: 1, createdAt: -1 });
newsSchema.index({ status: 1, category: 1, createdAt: -1 });
newsSchema.index({ status: 1, district: 1, createdAt: -1 });
newsSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('News', newsSchema);
