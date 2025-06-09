const isAdmin = (req, res, next) => {
    if (req.user.admin == false) {
        return res.status(500).json({ error: 'you are not authorized' });
    }
    return next();
};

module.exports = isAdmin;
