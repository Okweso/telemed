const express = require('express');
const {registerAdmin, loginAdmin} = require('../controllers/adminControllers');
const {check} = require('express-validator');
const router = express.Router();

router.post(
    '/register',
    [
        check('username', 'Username is required').not().isEmpty(),
        check('role', 'Roel is required').not().isEmpty(),
        check('password', 'password must be at least 6 characters').isLength({min: 6})

    ],
    registerAdmin
);

router.post('/login', loginAdmin);

module.exports = router;