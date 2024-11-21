const db = require('../config/db');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');

//function for registering doctors
exports.registerDoctor = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.status(400).json({message: 'please correct validation errors', error: errors.array()})
    }

    try{
        const {first_name, last_name, specialization, email, phone, schedule, password} = req.body;
        const [doctor] = await db.execute('SELECT first_name, email FROM doctors WHERE email = ?', [email]);
        if (doctor.length > 0){
            return res.status(400).json({message: 'doctor with the email already exist'})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.execute('INSERT INTO doctors (first_name, last_name, specialization, email, phone, schedule, password) VALUES(?,?,?,?,?,?,?)', [first_name, last_name, specialization, email, phone, schedule, hashedPassword]);
        return res.status(201).json({message: 'doctor registered successfully'});
    } catch(error){
        res.status(500).json({message: 'An error occured', error: error.message})
    }

}

//function to login
exports.loginDoctor = async (req, res) => {
    try{
        const {email, password} =req.body;
        try{
            const [doctor] = await db.execute('SELECT * FROM doctors WHERE email = ?', [email]);
            if (doctor.length === 0){
                return res.status(400).json({message: 'doctor with the email does not exist'});
            }
            const isMatch = await bcrypt.compare(password, doctor[0].password);

            if (!isMatch){
                return res.status(400).json({message: 'invalid email/password combination'});
            }

            req.session.doctorId = doctor[0].doctor_id
            req.session.first_name = doctor[0].first_name
            req.session.last_name = doctor[0].last_name
            req.session.specialization = doctor[0].specialization
            req.session.email = doctor[0].email
            req.session.shcedule = doctor[0].shcedule

            return res.status(200).json({message: 'Login successful'});
        } catch (error){
            console.error(error);
            return res.status(500).json({message: 'An error occured when trying to login', error: error.message});
        }
    } catch (error){
        console.error(error);
        return res.status(500).json({message: 'An error occurred', error: error.message})
    }
    
}

exports.logoutDoctor = async (req, res) => {
    req.session.destroy((error) => {
        if (error){
            console.error(error);
            res.status(500).json({message: 'An error occured while trying to logout', error: error.message});
        }
        return res.status(200).json({message: 'You have logged out'})
    });
}

//function to get doctor information for editting
exports.getDoctor = async (req, res) => {
    if (!req.session.doctorId) {
        return res.status(404).json({message: 'Unauthorized'});
    }
    try{
        const [doctor] = await db.execute('SELECT * FROM doctors WHERE doctor_id = ?', [req.session.doctorId]);
        if (doctor.length === 0){
            res.status(400).json({message: 'doctor details not found'})
        }
        res.status(200).json({message: 'Doctor details fetched for editting', doctor: doctor[0]});

    } catch (error){
        console.error(error);
        res.status(500).json({message: 'An error occured', error: error.message})
    }
}

exports.getDoctos = async (req, res) => {
    try{
        const [doctors] = await db.execute('SELECT * FROM doctors');
        if (doctors.length === 0){
            res.status(400).json({message: 'No doctors available'})
        }
        res.status(200).json({message: 'Doctors fetched successfully', doctors: doctors})
    } catch (error){
        res.status(500).json({message: 'An error occured', error: error.message})
    }
}

exports.doctorAppointments = async (req, res) =>{
    if (!req.session.doctorId){
        return res.status(400).json({message: "Unauthorized"})
    }
    try{
        const [appointments] = await db.execute("SELECT * FROM appointments WHERE doctor_id = ?", [req.session.doctorId]);
        if (appointments.length === 0){
            res.status(400).json({message: "No appointments"})
        }
        res.status(200).json({message: "Appointments fetched successfully", appointments:appointments})
    } catch (error){
        res.status(500).json({message: "An error occured", error: error.message})
    }
}


//function for editting doctor details
exports.editDoctor = async (req, res) =>{
    const errors = validationResult(req);

    if (!errors.isEmpty){
        res.status(400).json({message: 'please correct validation errors', error: errors.array()});
    }
    const {first_name, last_name, specialization, email, phone, schedule, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!req.session.doctorId){
        return res.status(401).json({message: 'Unauthorized! Please login to continue!'});
    }
    try{
        db.execute('UPDATE doctors SET first_name = ?, last_name = ?, specialization = ?, email = ?, phone = ?, schedule = ?, password = ?', [first_name, last_name, specialization, email, phone, schedule, hashedPassword]);
    return res.status(200).json({message: 'Details updated successfully'});
    } catch (error){
        console.error(error);
        return res.status(500).json({message: 'An error occured while updating data', error: error.message});
    }
}