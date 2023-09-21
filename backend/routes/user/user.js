const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth/auth');



router.get('/', auth, (req, res) => {
    const { user } = req;
    res.status(200).json({ user });
});



module.exports = router;
