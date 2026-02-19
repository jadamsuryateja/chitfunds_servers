const Admin = require('../models/Admin');
const Client = require('../models/Client');
const generateToken = require('../utils/generateToken');

// @desc    Auth Admin & get token
// @route   POST /api/auth/admin/login
// @access  Public
const authAdmin = async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
        res.json({
            _id: admin._id,
            email: admin.email,
            role: admin.role,
            token: generateToken(admin._id, admin.role),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Auth Client & get token
// @route   POST /api/auth/client/login
// @access  Public
const authClient = async (req, res) => {
    const { email, password } = req.body;

    const client = await Client.findOne({ email });

    if (client) {
        if (client.accountActive === false) {
            return res.status(401).json({ message: 'Account is deactivated. Contact admin.' });
        }

        if (await client.matchPassword(password)) {
            res.json({
                _id: client._id,
                email: client.email,
                clientId: client.clientId,
                fullName: client.fullName,
                role: client.role,
                isProfileComplete: !!(client.aadhaarImage && client.address),
                token: generateToken(client._id, client.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

module.exports = { authAdmin, authClient };
