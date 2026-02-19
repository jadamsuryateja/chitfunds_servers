const State = require('../models/State');
const Category = require('../models/Category');
const District = require('../models/District');

// @desc    Get all states
// @route   GET /api/cms/states
// @access  Private/Admin/BlogAdmin
const getStates = async (req, res) => {
    try {
        const states = await State.find().sort({ order: 1, name: 1 });
        res.json(states);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a state
// @route   POST /api/cms/states
// @access  Private/Admin/BlogAdmin
const createState = async (req, res) => {
    try {
        const { name, code, isActive, order } = req.body;

        const stateExists = await State.findOne({ $or: [{ name }, { code }] });
        if (stateExists) {
            return res.status(400).json({ message: 'State already exists' });
        }

        const state = await State.create({ name, code, isActive, order });
        res.status(201).json(state);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a state
// @route   PUT /api/cms/states/:id
// @access  Private/Admin/BlogAdmin
const updateState = async (req, res) => {
    try {
        const state = await State.findById(req.params.id);
        if (!state) {
            return res.status(404).json({ message: 'State not found' });
        }

        const updatedState = await State.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedState);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a state
// @route   DELETE /api/cms/states/:id
// @access  Private/Admin/BlogAdmin
const deleteState = async (req, res) => {
    try {
        const state = await State.findById(req.params.id);
        if (!state) {
            return res.status(404).json({ message: 'State not found' });
        }

        await state.deleteOne();
        res.json({ message: 'State removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all categories
// @route   GET /api/cms/categories
// @access  Private/Admin/BlogAdmin
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ order: 1, name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a category
// @route   POST /api/cms/categories
// @access  Private/Admin/BlogAdmin
const createCategory = async (req, res) => {
    try {
        const { name, type, isActive, order } = req.body;

        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = await Category.create({ name, type, isActive, order });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a category
// @route   PUT /api/cms/categories/:id
// @access  Private/Admin/BlogAdmin
const updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a category
// @route   DELETE /api/cms/categories/:id
// @access  Private/Admin/BlogAdmin
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await category.deleteOne();
        res.json({ message: 'Category removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all districts (optionally by state)
// @route   GET /api/cms/districts
// @access  Private/Admin
const getDistricts = async (req, res) => {
    try {
        const query = req.query.state ? { state: req.query.state } : {};
        const districts = await District.find(query).populate('state', 'name').sort({ name: 1 });
        res.json(districts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create new district
// @route   POST /api/cms/districts
// @access  Private/Admin
const createDistrict = async (req, res) => {
    try {
        const { name, state } = req.body;
        const district = await District.create({ name, state });
        res.status(201).json(district);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update district
// @route   PUT /api/cms/districts/:id
// @access  Private/Admin
const updateDistrict = async (req, res) => {
    try {
        const { name, state } = req.body;
        const district = await District.findById(req.params.id);

        if (!district) {
            return res.status(404).json({ message: 'District not found' });
        }

        district.name = name || district.name;
        district.state = state || district.state;

        const updatedDistrict = await district.save();
        res.json(updatedDistrict);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete district
// @route   DELETE /api/cms/districts/:id
// @access  Private/Admin
const deleteDistrict = async (req, res) => {
    try {
        const district = await District.findById(req.params.id);
        if (!district) {
            return res.status(404).json({ message: 'District not found' });
        }
        await district.deleteOne();
        res.json({ message: 'District removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getStates,
    createState,
    updateState,
    deleteState,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getDistricts,
    createDistrict,
    updateDistrict,
    deleteDistrict
};
