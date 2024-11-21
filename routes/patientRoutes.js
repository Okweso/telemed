const express = require('express');
const {registerPatient, logoutPatient, getPatient, editPatient, patientAppointments, getPatients} = require('../controllers/patientControllers');
const {check} = require('express-validator');
const { patientLogin } = require('../controllers/patientControllers');
const router = express.Router();

//register patient
router.post(
    '/register',
    [
        check('first_name', 'First name is required').not().isEmpty(),
        check('last_name', 'Last name is required').not().isEmpty(),
        check('email', 'Please provide a valid email').isEmail(),
        check('phone', 'Phone number is required').not().isEmpty(),
        check('date_of_birth', 'Date of birth is required').not().isEmpty(),
        check('selectedGender', 'Please select your gender').not().isEmpty(),
        check('address', 'Address is required').not().isEmpty(),
        check('password', 'Password must be at least 6 characters').isLength({min: 6})
    ],
    registerPatient
);

//patient login
router.post('/login', patientLogin);

//fetch patient details for editing
router.get('/patient', getPatient);

//fetch all patients
router.get('/patients', getPatients);

// //edit patient details
router.put(
    '/patient/edit',
    [
        check('first_name', 'First name is required').not().isEmpty(),
        check('second_name', 'Second name is required').not().isEmpty(),
        check('email', 'Please provide a valid email').isEmail(),
        check('phone', 'Phone number is required').not().isEmpty(),
        check('date_of_birth', 'Date of birth is required').not().isEmpty(),
        check('selectedGender', 'Please select your gender').not().isEmpty(),
        check('address', 'Address is required').not().isEmpty(),
        check('password', 'Password must be at least 6 characters').isLength({min: 6})
    ],
    editPatient
);

//logout
router.get('/logout', logoutPatient);

//fetch patient appointments
router.get('/appointment', patientAppointments);

module.exports = router;
