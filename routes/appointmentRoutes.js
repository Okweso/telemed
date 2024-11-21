const express = require('express');
const {addAppointment} = require('../controllers/appointmentControllers');
const {check} = require('express-validator');
const router = express.Router();

router.post(
    '/add_appointment',
    [
        check('appointment_date', 'Appointment date is required').not().isEmpty(),
        check('appointment_time', 'Appointment time is required').not().isEmpty(),
        //check('docotr_id', "Please select a doctor").not().isEmpty(),
        //check('patient_id', 'patient id is required').not().isEmpty()
    ],
    addAppointment
);

module.exports = router;