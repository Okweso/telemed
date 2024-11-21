const db = require('../config/db');
const {validationResult} = require('express-validator');

exports.addAppointment = async (req, res) =>{
    const errors = validationResult(req)

    if (!req.session.patientId){
        return res.status(400).json({message: 'Unauthorized'})
    }

    if (!errors.isEmpty()){
        return res.status(400).json({message: "Please correct validation errors", error: errors.array()})
    }
    try {
        const {doctor_id, appointment_date, appointment_time, status} = req.body;
        const [doc_schedule] = await db.execute('SELECT * FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ?', [doctor_id, appointment_date, appointment_time]);
        if (doc_schedule.length>0) {
            return res.status(400).json('The doctor has an appointment at this time')
        }
        await db.execute('INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES(?,?,?,?,?)', [req.session.patientId, doctor_id, appointment_date, appointment_time, status]);
        return res.status(201).json({message: 'Appointment booked successfully'});
    } catch (error) {
        return res.status(500).json({message: 'An error occured', error: error.message})
    }
}

