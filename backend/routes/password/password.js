const User = require('../../models/User');

const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth/auth');
const useBody = require('../../middleware/format/useBody');



router.post('/reset', (req, res, next) => useBody(req, res, next, ['email']), async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
        .catch(err => {
            console.error(err);
            user = null;
        });
    if (!user) return res.status(404).json({ success: false, message: 'No such user found.' });

    try {
        user.resetPassword();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Encountered error resetting password. Please try again later.' });
    }

    res.status(200).json({ success: true });
});



router.post('/reset/auth', (req, res, next) => useBody(req, res, next, ['resetPasswordAuthStr']), async (req, res) => {
    let user = await User.findOne({ resetPasswordAuthStr: req.body.resetPasswordAuthStr })
        .catch(err => {
            console.error(err);
            user = null;
        });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid password reset link...' });

    res.status(200).json({ success: true, email: user.email });
});



router.post('/reset/enter-new-password', (req, res, next) => useBody(req, res, next, ['email', 'password', 'confPassword']), async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
        .catch(err => {
            console.error(err);
            user = null;
        });
    if (!user) return res.status(404).json({ success: false, message: 'No such user exists' });

    if (req.body.password !== req.body.confPassword || req.body.password === '') return res.status(400).json({ success: false, message: 'Erorr. Passwords do not match.' });
    const hashedPassword = await User.hashPassword(req.body.password);

    try {
        await user.setNewPassword(hashedPassword);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Encountered error setting new password. Please try again later.' });
    }

    res.status(201).json({ success: true });
});



router.post('/change', auth, (req, res, next) => useBody(req, res, next, ['password', 'confPassword']), async (req, res) => {
    const { user } = req;

    if (req.body.password !== req.body.confPassword || req.body.password === '') return res.status(400).json({ success: false, message: 'Erorr. Passwords do not match.' });
    const hashedPassword = await User.hashPassword(req.body.password);

    try {
        await user.setNewPassword(hashedPassword);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Encountered error setting new password. Please try again later.' });
    }

    res.status(201).json({ success: true });
});



module.exports = router;