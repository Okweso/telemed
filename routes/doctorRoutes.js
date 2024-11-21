const express = require('express');
const {registerDoctor, loginDoctor, logoutDoctor, getDoctor, editDoctor, doctorAppointments, getDoctos} = require('../controllers/doctorControllers');
const {check} = require('express-validator');
const router = express.Router();

//register doctror 
router.post(
    '/register',
    [
        check('first_name', 'Firstname is required').not().isEmpty(),
        check('last_name', 'Lastname is required').not().isEmpty(),
        check('specialization', 'Specialization is required').not().isEmail(),
        check('email', 'Please enter a valid email').not().isEmpty(),
        check('phone', 'Phone number is required').not().isEmpty(),
        //check('address', 'Address must be filled').not().isEmpty(),
        check('password', 'password must be at least 6 characters').isLength({min: 6})

    ],
    registerDoctor
);

//doctor login
router.post('/login', loginDoctor);

//fetch doctor details for editting
router.get('/doctor', getDoctor);

//fetch doctor appointments
router.get('/appointments', doctorAppointments);

//fetch all doctors
router.get('/doctors', getDoctos);

//edit doctor details
router.put(
    '/doctor/edit',
    [
        check('first_name', 'Firstname is required').not().isEmpty(),
        check('last_name', 'Lastname is required').not().isEmpty(),
        check('specialization', 'Specialization is required').not().isEmail(),
        check('email', 'Please enter a valid email').not().isEmpty(),
        check('phone', 'Phone number is required').not().isEmpty(),
        check('address', 'Address must be filled').not().isEmpty(),
        check('password', 'password must be at least 6 characters').isLength({min: 6})
    ],
    editDoctor
);

//logout doctor
router.get('/logout', logoutDoctor);

module.exports = router;