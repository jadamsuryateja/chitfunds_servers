const Client = require('../models/Client');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// @desc    Get client profile/dashboard data
// @route   GET /api/client/profile
// @access  Private/Client
const getClientProfile = async (req, res) => {
    const client = await Client.findById(req.user._id).select('-password');

    if (client) {
        res.json(client);
    } else {
        res.status(404).json({ message: 'Client not found' });
    }
};

// @desc    Update client profile (First time setup)
// @route   PUT /api/client/profile
// @access  Private/Client
const updateClientProfile = async (req, res) => {
    const client = await Client.findById(req.user._id);

    if (client) {
        // Handle Aadhaar Image Upload
        let aadhaarUrl = client.aadhaarImage;
        if (req.files && req.files.aadhaarImage) {
            console.log('Aadhaar upload path:', req.files.aadhaarImage[0].path);
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
                console.error("Aadhaar Upload Error:", error);
                return res.status(500).json({ message: 'Aadhaar upload failed: ' + error.message });
            }
        }

        // Handle Profile Image Upload
        let profileUrl = client.profileImage;
        if (req.files && req.files.profileImage) {
            console.log('Profile image upload path:', req.files.profileImage[0].path);
            try {
                const result = await cloudinary.uploader.upload(req.files.profileImage[0].path, {
                    folder: 'chitfunds/profiles',
                });
                profileUrl = result.secure_url;
                if (fs.existsSync(req.files.profileImage[0].path)) {
                    fs.unlinkSync(req.files.profileImage[0].path);
                }
            } catch (error) {
                console.error("Profile image Upload Error:", error);
                // We might want to continue even if profile image fails, but for now let's error
                return res.status(500).json({ message: 'Profile image upload failed: ' + error.message });
            }
        }

        client.address = req.body.address || client.address;
        client.fatherName = req.body.fatherName || client.fatherName;
        client.village = req.body.village || client.village;
        client.mandal = req.body.mandal || client.mandal;
        client.district = req.body.district || client.district;
        client.state = req.body.state || client.state;
        client.phone = req.body.phone || client.phone;
        client.aadhaarNumber = req.body.aadhaarNumber || client.aadhaarNumber;
        client.aadhaarImage = aadhaarUrl;
        client.profileImage = profileUrl;

        const updatedClient = await client.save();

        // Return updated fields needed for frontend state
        res.json({
            _id: updatedClient._id,
            fullName: updatedClient.fullName,
            address: updatedClient.address,
            fatherName: updatedClient.fatherName,
            village: updatedClient.village,
            mandal: updatedClient.mandal,
            district: updatedClient.district,
            state: updatedClient.state,
            phone: updatedClient.phone,
            aadhaarNumber: updatedClient.aadhaarNumber,
            aadhaarImage: updatedClient.aadhaarImage,
            profileImage: updatedClient.profileImage,
            isProfileComplete: !!(updatedClient.aadhaarImage && updatedClient.address),
        });

    } else {
        res.status(404).json({ message: 'Client not found' });
    }
};

// @desc    Upload a document for self
// @route   POST /api/client/profile/documents
// @access  Private/Client
const uploadMyDocument = async (req, res) => {
    const { title } = req.body;
    const client = await Client.findById(req.user._id);

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

// @desc    Delete a personal document
// @route   DELETE /api/client/profile/documents/:docId
// @access  Private/Client
const deleteMyDocument = async (req, res) => {
    const client = await Client.findById(req.user._id);

    if (client) {
        const doc = client.documents.id(req.params.docId);

        if (doc) {
            // Remove from Cloudinary
            if (doc.publicId) {
                try {
                    await cloudinary.uploader.destroy(doc.publicId);
                } catch (error) {
                    console.error("Cloudinary Delete Error:", error);
                }
            }

            // Remove from array
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
    getClientProfile,
    updateClientProfile,
    uploadMyDocument,
    deleteMyDocument
};
