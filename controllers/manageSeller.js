const User = require('../models/user');

async function changeUserRole(req, res) {
    try {
        const { email, action, shopId } = req.body;
        if (!email || !action) {
            return res.status(400).json({ message: 'Email and action are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (action === 'add') {
            if (!shopId) return res.status(400).json({ message: "shopId is required to add seller" });
            if (user.role === 'SELLER') {
                return res.status(200).json({ message: 'User is already a SELLER', user });
            }
            user.role = 'SELLER';
            user.shopId = shopId;
            await user.save();
            return res.json({ message: 'User role changed to SELLER', user });
        } else if (action === 'remove') {
            if (user.role === 'CUSTOMER') {
                return res.status(200).json({ message: 'User is already a CUSTOMER', user });
            }
            user.role = 'CUSTOMER';
            user.shopId = null;
            await user.save();
            return res.json({ message: 'User is no longer a SELLER', user });
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role', error: error.message });
    }
}

async function getAllSellers(req, res) {
    try {
        const sellers = await User.find({ role: 'SELLER' })
            .select('name email _id')
            .populate('shopId', 'name')
            .sort({ name: 1 });
        
        return res.json({ 
            success: true,
            sellers,
            count: sellers.length
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error fetching sellers', 
            error: error.message 
        });
    }
}

module.exports = { changeUserRole, getAllSellers };