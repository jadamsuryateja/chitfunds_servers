const News = require('../models/News');
const State = require('../models/State');
const District = require('../models/District');
const Category = require('../models/Category');

// @desc    Get all news (Public with filters)
// @route   GET /api/news
// @access  Public
const getNews = async (req, res) => {
    try {
        const { state, category, tag, search, featured, trending, banner, date, stateName, districtSlug, categorySlug } = req.query;
        let query = { status: 'published' };

        if (state) query.state = state;
        if (category) query.category = category;
        if (tag) query.tags = { $in: [tag] };
        if (featured === 'true') query.isTopStory = true;
        if (trending === 'true') query.isTrending = true;
        if (banner === 'true') query.isBanner = true;

        // Server-side name/slug-based filtering (avoids fetching everything)
        if (stateName) {
            const s = await State.findOne({
                $or: [{ name: { $regex: `^${stateName}$`, $options: 'i' } }, { code: { $regex: `^${stateName}$`, $options: 'i' } }]
            }).select('_id').lean();
            if (s) query.state = s._id;
            else return res.json([]);
        }
        if (districtSlug) {
            const d = await District.findOne({
                $or: [{ slug: districtSlug }, { name: { $regex: `^${districtSlug.replace(/-/g, ' ')}$`, $options: 'i' } }]
            }).select('_id').lean();
            if (d) query.district = d._id;
            else return res.json([]);
        }
        if (categorySlug) {
            const c = await Category.findOne({
                $or: [{ slug: categorySlug }, { name: { $regex: `^${categorySlug.replace(/-/g, ' ')}$`, $options: 'i' } }]
            }).select('_id').lean();
            if (c) query.category = c._id;
            else return res.json([]);
        }

        if (search) {
            // Run state + district + category lookups in parallel for speed
            const [matchingStates, matchingDistricts, matchingCategories] = await Promise.all([
                State.find({
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { code: { $regex: search, $options: 'i' } }
                    ]
                }).select('_id').lean(),
                District.find({
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { slug: { $regex: search, $options: 'i' } }
                    ]
                }).select('_id').lean(),
                Category.find({
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { slug: { $regex: search, $options: 'i' } }
                    ]
                }).select('_id').lean()
            ]);

            const stateIds = matchingStates.map(s => s._id);
            const districtIds = matchingDistricts.map(d => d._id);
            const categoryIds = matchingCategories.map(c => c._id);

            const orConditions = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
            if (stateIds.length > 0) orConditions.push({ state: { $in: stateIds } });
            if (districtIds.length > 0) orConditions.push({ district: { $in: districtIds } });
            if (categoryIds.length > 0) orConditions.push({ category: { $in: categoryIds } });

            query.$or = orConditions;
        }

        // Date filter: defaults to today, pass date=all to get everything
        // Skip date filter when searching so results span all dates
        if (date !== 'all' && !search) {
            const filterDate = date ? new Date(date + 'T00:00:00') : new Date();
            const startOfDay = new Date(filterDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(filterDate);
            endOfDay.setHours(23, 59, 59, 999);
            query.createdAt = { $gte: startOfDay, $lte: endOfDay };
        }

        const news = await News.find(query)
            .populate('state', 'name code')
            .populate('district', 'name slug')
            .populate('category', 'name slug')
            .populate('author', 'name')
            .sort({ publishedAt: -1, createdAt: -1 })
            .limit(100)
            .lean();

        res.json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single news by slug
// @route   GET /api/news/slug/:slug
// @access  Public
const getNewsBySlug = async (req, res) => {
    try {
        const news = await News.findOne({ slug: req.params.slug, status: 'published' })
            .populate('state', 'name code')
            .populate('district', 'name slug')
            .populate('category', 'name slug')
            .populate('author', 'name');

        if (!news) {
            return res.status(404).json({ message: 'News article not found' });
        }

        // Increment views
        news.views += 1;
        await news.save({ validateBeforeSave: false });

        res.json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single news by ID
// @route   GET /api/news/:id
// @access  Public
const getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id)
            .populate('state', 'name code')
            .populate('district', 'name slug')
            .populate('category', 'name slug')
            .populate('author', 'name');

        if (!news) {
            return res.status(404).json({ message: 'News article not found' });
        }

        res.json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create new news article
// @route   POST /api/news
// @access  Private/Admin
const createNews = async (req, res) => {
    try {
        const { title, description, content, image, bannerImage, state, district, category, tags, status, isTopStory, isTrending, isBanner } = req.body;

        const news = await News.create({
            title,
            description,
            content,
            image,
            bannerImage,
            state: (state && state !== '') ? state : null,
            district: (district && district !== '') ? district : null,
            category: (category && category !== '') ? category : null,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            status: status || 'draft',
            isTopStory: isTopStory || false,
            isTrending: isTrending || false,
            isBanner: isBanner || false,
            author: req.user._id,
            publishedAt: status === 'published' ? Date.now() : null
        });

        res.status(201).json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update news article
// @route   PUT /api/news/:id
// @access  Private/Admin
const updateNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }

        const { title, description, content, image, bannerImage, state, district, category, tags, status, isTopStory, isTrending, isBanner } = req.body;

        news.title = title || news.title;
        news.description = description || news.description;
        news.content = content || news.content;
        news.image = image || news.image;
        news.bannerImage = bannerImage || news.bannerImage;
        news.state = (state && state !== '') ? state : ((state === '') ? null : news.state);
        news.district = (district && district !== '') ? district : ((district === '') ? null : news.district);
        news.category = (category && category !== '') ? category : news.category;
        news.tags = tags ? tags.split(',').map(tag => tag.trim()) : news.tags;
        news.status = status || news.status;
        news.isTopStory = isTopStory !== undefined ? isTopStory : news.isTopStory;
        news.isTrending = isTrending !== undefined ? isTrending : news.isTrending;
        news.isBanner = isBanner !== undefined ? isBanner : news.isBanner;

        if (status === 'published' && !news.publishedAt) {
            news.publishedAt = Date.now();
        }

        const updatedNews = await news.save();
        res.json(updatedNews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete news article
// @route   DELETE /api/news/:id
// @access  Private/Admin
const deleteNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }

        await news.deleteOne();
        res.json({ message: 'News removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Dashboard Stats
// @route   GET /api/news/stats/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const totalPosts = await News.countDocuments();
        const publishedPosts = await News.countDocuments({ status: 'published' });
        const draftPosts = await News.countDocuments({ status: 'draft' });
        const totalCategories = await Category.countDocuments();
        const totalStates = await State.countDocuments();

        // State-wise distribution
        const stateStats = await News.aggregate([
            { $match: { state: { $ne: null } } },
            { $group: { _id: "$state", count: { $sum: 1 } } },
            { $lookup: { from: "states", localField: "_id", foreignField: "_id", as: "stateInfo" } },
            { $unwind: "$stateInfo" },
            { $project: { name: "$stateInfo.name", count: 1 } }
        ]);

        res.json({
            totalPosts,
            publishedPosts,
            draftPosts,
            totalCategories,
            totalStates,
            stateStats
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all news for Admin (CMS)
// @route   GET /api/news/cms/all
// @access  Private/Admin
const getAdminNews = async (req, res) => {
    try {
        const { status, search } = req.query;
        let query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const news = await News.find(query)
            .populate('state', 'name code')
            .populate('category', 'name slug')
            .populate('author', 'name')
            .sort({ createdAt: -1 });

        res.json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getNews,
    getNewsBySlug,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
    getDashboardStats,
    getAdminNews
};
