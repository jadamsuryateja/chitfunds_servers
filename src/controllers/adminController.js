const Client = require('../models/Client');
const generateToken = require('../utils/generateToken');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// @desc    Register a new client
// @route   POST /api/admin/clients
// @access  Private/Admin
const registerClient = async (req, res) => {
    const { email, password, fullName } = req.body;

    const clientExists = await Client.findOne({ email });

    if (clientExists) {
        return res.status(400).json({ message: 'Client already exists' });
    }

    // Generate Unique Client ID (CHF01, CHF02, ...)
    let nextId = 'CHF01';
    const lastClient = await Client.findOne({ clientId: { $regex: /^CHF\d+$/ } }).sort({ createdAt: -1 });

    if (lastClient && lastClient.clientId) {
        const lastIdNum = parseInt(lastClient.clientId.replace('CHF', ''));
        if (!isNaN(lastIdNum)) {
            nextId = `CHF${String(lastIdNum + 1).padStart(2, '0')}`;
        }
    }

    const client = await Client.create({
        email,
        password,
        fullName,
        clientId: nextId,
        createdBy: req.user._id
    });

    if (client) {
        res.status(201).json({
            _id: client._id,
            email: client.email,
            clientId: client.clientId,
            fullName: client.fullName,
        });
    } else {
        res.status(400).json({ message: 'Invalid client data' });
    }
};

// @desc    Get all clients
// @route   GET /api/admin/clients
// @access  Private/Admin
const getClients = async (req, res) => {
    const clients = await Client.find({}).select('-password').sort({ createdAt: -1 });
    res.json(clients);
};

// @desc    Update client financials (Add transaction)
// @route   PUT /api/admin/clients/:id/financials
// @access  Private/Admin
const updateFinancials = async (req, res) => {
    const { type, amount, date, description, timePeriod } = req.body;
    const client = await Client.findById(req.params.id);

    if (client) {
        const transaction = {
            type, // 'given' or 'received'
            amount: Number(amount),
            date: date || Date.now(),
            description,
            timePeriod
        };

        client.financialRecords.push(transaction);
        await client.save();

        res.json(client.financialRecords);
    } else {
        res.status(404).json({ message: 'Client not found' });
    }
};

// @desc    Activate/Deactivate client
// @route   PUT /api/admin/clients/:id/status
// @access  Private/Admin
const toggleClientStatus = async (req, res) => {
    const client = await Client.findById(req.params.id);

    if (client) {
        client.accountActive = !client.accountActive;
        await client.save();
        res.json({ message: `Client ${client.accountActive ? 'activated' : 'deactivated'}` });
    } else {
        res.status(404).json({ message: 'Client not found' });
    }
};

// @desc    Delete a client
// @route   DELETE /api/admin/clients/:id
// @access  Private/Admin
const deleteClient = async (req, res) => {
    const client = await Client.findById(req.params.id);

    if (client) {
        await client.deleteOne();
        res.json({ message: 'Client removed' });
    } else {
        res.status(404).json({ message: 'Client not found' });
    }
};



// @desc    Update client details (Password, etc.)
// @route   PUT /api/admin/clients/:id
// @access  Private/Admin
const updateClient = async (req, res) => {
    const client = await Client.findById(req.params.id);

    if (client) {
        // Handle Aadhaar Image Upload
        let aadhaarUrl = client.aadhaarImage;
        if (req.files && req.files.aadhaarImage) {
            console.log('Admin Aadhaar upload path:', req.files.aadhaarImage[0].path);
            try {
                const result = await cloudinary.uploader.upload(req.files.aadhaarImage[0].path, {
                    folder: 'chitfunds/aadhaar',
                });
                aadhaarUrl = result.secure_url;
                // Clean up local file
                if (fs.existsSync(req.files.aadhaarImage[0].path)) {
                    fs.unlinkSync(req.files.aadhaarImage[0].path);
                }
            } catch (error) {
                console.error("Admin Aadhaar Upload Error:", error);
                return res.status(500).json({ message: 'Aadhaar upload failed: ' + error.message });
            }
        }

        // Handle Profile Image Upload
        let profileUrl = client.profileImage;
        if (req.files && req.files.profileImage) {
            console.log('Admin Profile image upload path:', req.files.profileImage[0].path);
            try {
                const result = await cloudinary.uploader.upload(req.files.profileImage[0].path, {
                    folder: 'chitfunds/profiles',
                });
                profileUrl = result.secure_url;
                if (fs.existsSync(req.files.profileImage[0].path)) {
                    fs.unlinkSync(req.files.profileImage[0].path);
                }
            } catch (error) {
                console.error("Admin Profile image Upload Error:", error);
                // We might want to continue even if profile image fails, but for now let's error
                return res.status(500).json({ message: 'Profile image upload failed: ' + error.message });
            }
        }

        client.fullName = req.body.fullName || client.fullName;
        client.email = req.body.email || client.email;
        client.fatherName = req.body.fatherName || client.fatherName;
        client.phone = req.body.phone || client.phone;
        client.aadhaarNumber = req.body.aadhaarNumber || client.aadhaarNumber;
        client.address = req.body.address || client.address;
        client.village = req.body.village || client.village;
        client.mandal = req.body.mandal || client.mandal;
        client.district = req.body.district || client.district;
        client.state = req.body.state || client.state;
        client.aadhaarImage = aadhaarUrl; // Update Image URL
        client.profileImage = profileUrl; // Update Image URL

        if (req.body.password) {
            client.password = req.body.password;
        }

        const updatedClient = await client.save();

        res.json({
            _id: updatedClient._id,
            fullName: updatedClient.fullName,
            email: updatedClient.email,
            clientId: updatedClient.clientId,
            phone: updatedClient.phone,
            fatherName: updatedClient.fatherName,
            aadhaarNumber: updatedClient.aadhaarNumber,
            address: updatedClient.address,
            village: updatedClient.village,
            mandal: updatedClient.mandal,
            district: updatedClient.district,
            state: updatedClient.state,
            aadhaarImage: updatedClient.aadhaarImage,
            profileImage: updatedClient.profileImage
        });
    } else {
        res.status(404).json({ message: 'Client not found' });
    }
};

// @desc    Upload a document for a client
// @route   POST /api/admin/clients/:id/documents
// @access  Private/Admin
const uploadClientDocument = async (req, res) => {
    const { title } = req.body;
    const client = await Client.findById(req.params.id);

    if (client) {
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'chitfunds/documents',
                });

                // Clean up local file
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }

                const newDoc = {
                    title: title || 'Untitled Document',
                    url: result.secure_url,
                    publicId: result.public_id
                };

                client.documents.push(newDoc);
                await client.save();

                res.status(201).json(client.documents);
            } catch (error) {
                console.error("Document Upload Error:", error);
                return res.status(500).json({ message: 'Document upload failed: ' + error.message });
            }
        } else {
            res.status(400).json({ message: 'No file uploaded' });
        }
    } else {
        res.status(404).json({ message: 'Client not found' });
    }
};

// @desc    Delete a client document
// @route   DELETE /api/admin/clients/:id/documents/:docId
// @access  Private/Admin
const deleteClientDocument = async (req, res) => {
    const client = await Client.findById(req.params.id);

    if (client) {
        const doc = client.documents.id(req.params.docId);

        if (doc) {
            // Remove from Cloudinary
            if (doc.publicId) {
                try {
                    await cloudinary.uploader.destroy(doc.publicId);
                } catch (error) {
                    console.error("Cloudinary Delete Error:", error);
                    // Continue to delete from DB even if Cloudinary fails, or maybe warn? 
                    // Usually better to ensure DB consistency.
                }
            } else {
                // Fallback for older images without publicId explicitly saved (if any)
                // Extract publicId from URL if possible, but for new system publicId is saved.
            }

            // Remove from array - Mongoose method
            client.documents.pull(req.params.docId);
            await client.save();

            res.json(client.documents);
        } else {
            res.status(404).json({ message: 'Document not found' });
        }
    } else {
        res.status(404).json({ message: 'Client not found' });
    }
};

module.exports = {
    registerClient,
    getClients,
    updateFinancials,
    toggleClientStatus,
    deleteClient,
    updateClient,
    uploadClientDocument,
    deleteClientDocument,
};
