//const { response } = require("express");

document.addEventListener('DOMContentLoaded', function() {
    let form = document.getElementById("registerForm");
    const form1 = document.getElementById("loginForm");
    const edit_form = document.getElementById("editForm");
    

    let messageDiv = document.getElementById("message");
    let editMessageDiv = document.getElementById("edit_message");

    function showMessage(type, text){
        messageDiv.style.display = 'block';
        if (type == 'success'){
            messageDiv.style.color = 'green';
        }
        else{
            messageDiv.style.color = 'red';
        }
        messageDiv.content = text;

        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000)
    }




    //submiting registration form
    if (form){
        form.addEventListener('submit', async (e) =>{
            e.preventDefault();
            const password = document.getElementById("password").value;
            const password1 = document.getElementById("password1").value;
            const first_name = document.getElementById("first_name").value;
            const last_name = document.getElementById("last_name").value;
            const email = document.getElementById("email").value;
            const phone = document.getElementById("phone").value;
            const date_of_birth = document.getElementById("dob").value;
            const address = document.getElementById("address").value;
            const gender = form.elements["gender"];

            let selectedGender = "";

                for (let i = 0; i < gender.length; i++) {
                    if (gender[i].checked) {
                        selectedGender = gender[i].value;
                        break;
                    }
                }

            if (!password === password1){
                alert("The two passwords must be the same");
                return;
            }
            //transmit the data
            const response = await fetch('/telemedicine/api/patients/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({first_name, last_name, email, phone, selectedGender, date_of_birth, address, password})
            });
            const result = await response.json();

            if (response.status === 201){
                showMessage('success', result.message);
                alert(result.message);
            }
            else{
                showMessage('failed', result.message);
                alert(result.message);
            }
        });
    }

    //login form submit
    if (form1) {
        form1.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;

            //transmit data
            const response = await fetch('/telemedicine/api/patients/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password}),
                //redirect: "manual"
            })
            //console.log(response.headers.get('content-type'));

            const result = await response.json();

            if (response.status === 200){
                //showMessage('success', result.message);
                alert(result.message);
                window.location.href = '/patient_dashboard'
                
            }
            else{
                //showMessage('failed', result.message);
                alert(result.message);
            }

        });
    }

    //submitting edit form
if (edit_form){
    edit_form.addEventListener('submit', async (e) =>{
        e.preventDefault();
        const password = document.getElementById("edit_password").value;
        const password1 = document.getElementById("edit_password1").value;
        const first_name = document.getElementById("edit_first_name").value;
        const last_name = document.getElementById("edit_last_name").value;
        const email = document.getElementById("edit_email").value;
        const phone = document.getElementById("edit_phone").value;
        const date_of_birth = document.getElementById("edit_dob").value;
        const address = document.getElementById("edit_address").value;
        const gender = edit_form.elements["edit_gender"];

        let selectedGender = "";

            for (let i = 0; i < gender.length; i++) {
                if (gender[i].checked) {
                    selectedGender = gender[i].value;
                    break;
                }
            }

        if (!password === password1){
            alert("The two passwords must be the same");
            return;
        }
        //transmit the data
        const response = await fetch('/telemedicine/api/patients/patient/edit', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({first_name, last_name, email, phone, selectedGender, date_of_birth, address, password})
        });
        const result = await response.json();

        if (response.status === 201){
            //showMessage('success', result.message);
            alert(result.message);
        }
        else{
            //showMessage('failed', result.message);
            alert(result.message);
        }
    });
}



})

//fetch user details

async function getPatient(){
    const name = document.getElementById("name");
    const name1 = document.getElementById("name1");
    const email = document.getElementById("email_address");
    const phone = document.getElementById("phone_number");
    const address = document.getElementById("patient_address");
    const response = await fetch('/telemedicine/api/patients/patient', {
        method: 'GET'
    });
    if (response.status === 200){
        const result = await response.json();
        console.log(result);
        name.textContent = result.patient.first_name
        name1.textContent = result.patient.last_name
        email.textContent = result.patient.email
        phone.textContent = result.patient.phone
        address.textContent = result.patient.address
    }
    else{
        console.log(response.message)
    }
}
getPatient();

//logout
const logoutbutton = document.querySelector(".logout-btn");

logoutbutton.addEventListener('click', async () => {
    const response = await fetch('/telemedicine/api/patients/logout', {
        method: 'GET'
    });
    console.log('response:', response)
    if (response.status === 200){
        response.json().then(result => {
            alert(result.message)
        });
       window.location.href = '/patient_login'
    } else{
        alert(result.message)
    }
})

async function getDoc(){
    const response = await fetch('/telemedicine/api/doctors/doctors', {
        method: 'GET'
    });
    if (response.status === 200){
        const result = await response.json()
        const selectElement = document.getElementById('doctor')
        result.doctors.forEach(doctor => {
            const option = document.createElement('option')
            option.value = doctor.doctor_id
            option.textContent = `${doctor.first_name} ${doctor.last_name}`
            selectElement.appendChild(option)
            // doc_id = doctor.doctor_id
            // doc_first_name = doctor.first_name
            // doc_last_name = doctor.last_name
            // console.log(doc_first_name, doc_last_name, doc_id)
        })
        
        //console.log('Doctors fetched are: ', result)
    }
}
getDoc()

const appointment_form = document.getElementById('submit_appointment_form');

if (appointment_form){
    appointment_form.addEventListener('submit', async (e)=> {
        e.preventDefault();
        const doctor_id = document.getElementById('doctor').value
        const appointment_date = document.getElementById('date').value
        const appointment_time = document.getElementById('time').value
        const status = 'Pending'

        const response = await fetch('/telemedicine/api/appointments/add_appointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({doctor_id, appointment_date, appointment_time, status})
        });
        const result = await response.json()
        if (result.status === 201){
            alert(result.message)
        }
        else{
            alert(result.message)
        }
    })
}


const book_appointment = document.querySelector('.book-appointment-btn')
const dashboard = document.querySelector('.dashboard-container')
const formSection = document.getElementById('form-section');
const cancelBtn = document.getElementById('appointment_cancel');

book_appointment.addEventListener('click', () =>{
    formSection.classList.remove('hidden');
    dashboard.classList.add('blur-background');
});

cancelBtn.addEventListener('click', () =>{
    formSection.classList.add('hidden');
    dashboard.classList.remove('blur-background');
})




const editSection = document.getElementById('edit-section');
const editForm = document.getElementById('editForm');
const cancelButton = document.getElementById('cancel_button');
const editButtons = document.querySelectorAll('.edit-btn');

// Show the form and blur background when edit button is clicked
editButtons.forEach(button => {
    button.addEventListener('click', () => {
        editSection.style.display = 'flex';
        document.body.classList.add('blurred');
    });
});

// Hide the form and remove blur when cancel button is clicked
cancelButton.addEventListener('click', () => {
    editSection.style.display = 'none';
    document.body.classList.remove('blur-background');
});

// Prevent form submission for testing purposes (optional)
editForm.addEventListener('submit', (e) => {
    e.preventDefault();
   // alert('Form submitted');
    editSection.style.display = 'none';
    document.body.classList.remove('blur-background');
});


function formatDate(dateString){
    const options = {year: 'numeric', month: 'long', day: 'numeric'}
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', options).format(date)
}

const appointment = document.getElementById('appointments')
const table = document.getElementById('appointment-table')
async function getAppointments() {
    try {
        // Fetch appointments
        const appointment_response = await fetch('/telemedicine/api/patients/appointment', {
            method: 'GET'
        });

        if (appointment_response.status !== 200) {
            console.error('Failed to fetch appointments');
            return;
        }

        const result = await appointment_response.json();

        // Fetch doctors (only once)
        const doctor_response = await fetch('/telemedicine/api/doctors/doctors', {
            method: 'GET'
        });

        if (doctor_response.status !== 200) {
            console.error('Failed to fetch doctors');
            return;
        }

        const doc_result = await doctor_response.json();

        // Create a map for quick lookup of doctor names by ID
        const doctorMap = {};
        doc_result.doctors.forEach(doc => {
            doctorMap[doc.doctor_id] = `${doc.first_name} ${doc.last_name}`;
        });

        // Populate the appointments table
        result.appointments.forEach(appointment => {
            const table_row = document.createElement('tr');

            // Doctor Name Cell
            const doc_cell = document.createElement('td');
            const doctorName = doctorMap[appointment.doctor_id] || 'Unknown Doctor';
            doc_cell.textContent = doctorName;
            table_row.appendChild(doc_cell);

            // Appointment Date Cell
            const date_cell = document.createElement('td');
            date_cell.textContent = formatDate(appointment.appointment_date);
            table_row.appendChild(date_cell);

            // Appointment Time Cell
            const time_cell = document.createElement('td');
            time_cell.textContent = appointment.appointment_time;
            table_row.appendChild(time_cell);

            // Appointment Status Cell
            const status_cell = document.createElement('td');
            status_cell.textContent = appointment.status;
            table_row.appendChild(status_cell);

            // Append row to table
            document.getElementById('appointment-table').appendChild(table_row);
        });
    } catch (error) {
        console.error('Error fetching appointments or doctors:', error);
    }
}

getAppointments()

