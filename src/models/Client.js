const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['given', 'received'], // 'given' by admin (client received), 'received' by admin (client paid)
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: String,
    timePeriod: String
});

const clientSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    clientId: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        default: ''
    },
    profileImage: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    fatherName: {
        type: String,
        default: ''
    },
    village: {
        type: String,
        default: ''
    },
    mandal: {
        type: String,
        default: ''
    },
    district: {
        type: String,
        default: ''
    },
    state: {
        type: String,
        default: ''
    },
    aadhaarNumber: {
        type: String,
        default: ''
    },
    aadhaarImage: {
        type: String, // Cloudinary URL
        default: ''
    },
    accountActive: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        default: 'client'
    },
    documents: [{
        title: { type: String, required: true },
        url: { type: String, required: true }, // Cloudinary URL
        publicId: String, // Cloudinary Public ID for deletion
        uploadedAt: { type: Date, default: Date.now }
    }],
    financialRecords: [transactionSchema],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }
}, { timestamps: true });

// Hash password
clientSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

clientSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Client', clientSchema);
