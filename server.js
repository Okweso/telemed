const db = require('./config/db');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const dotenv = require('dotenv');
const path = require('path');

//initialize env management
dotenv.config();

//initialize app
const app = express();

//confihure middleware
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); //capture form data


//configure session store
const sessionStore = new MySQLStore({}, db);

//configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 //1 hour
    }
}));

//routes

app.use('/telemedicine/api/patients', require('./routes/patientRoutes'))
app.use('/telemedicine/api/doctors', require('./routes/doctorRoutes'))
app.use('/telemedicine/api/appointments', require('./routes/appointmentRoutes'))
app.use('/telemedicine/api/admins', require('./routes/adminRoutes'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
})

app.get('/patients_register', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'patient_register.html'))
})

app.get('/patient_login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'patient_login.html'))
})

app.get('/patient_dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'patient_dashboard.html'))
})

app.get('/doctors_register', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'doctor_register.html'))
})

app.get('/doctor_login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'doctor_login.html'))
})

app.get('/doctor_dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'doctor_dashboard.html'))
})

app.get('/admins', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'admin_page.html'))
})

app.get('/admin_register', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'adminRegister.html'))
})

app.get('/admin_login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'adminLogin.html'))
})


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`)
})