const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State',
        required: true
    },
    slug: {
        type: String,
        lowercase: true,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

districtSchema.pre('save', function (next) {
    if (this.isModified('name') && !this.slug) {
        this.slug = this.name.toLowerCase().replace(/ /g, '-');
    }
    next();
});

module.exports = mongoose.model('District', districtSchema);
