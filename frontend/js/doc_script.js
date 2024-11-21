document.addEventListener("DOMContentLoaded", function() {
    let form = document.getElementById("doc_register");
    let form1 = document.getElementById("doc_login");
    const edit_form = document.getElementById("doc_edit_form");
    const edit_btn = document.getElementById("edit-btn");
    const cancel_btn = document.getElementById("doc_cancel");
    logout_btn = document.getElementById("logout");

    if (form) {
        form.addEventListener("submit", async (e) =>{
            e.preventDefault();

            const checkboxes = document.querySelectorAll('input[name="day"]:checked');
            const selectedDays = [];

            checkboxes.forEach((checkbox) => {
                selectedDays.push(checkbox.value);
            })

            const password = document.getElementById("password").value;
            const password1 = document.getElementById("password1").value;
            const first_name = document.getElementById("first_name").value;
            const last_name = document.getElementById("last_name").value;
            const specialization = document.getElementById("specialization").value;
            const email = document.getElementById("email").value;
            const phone = document.getElementById("phone").value;
            const schedule = selectedDays

            console.log(schedule)

            if (!password === password1) {
                alert("The two passwords must be the same");
                return;
            }
            
            const response = await fetch('/telemedicine/api/doctors/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({first_name, last_name, specialization, email, phone, schedule, password})
            });

            const result = await response.json();
            if (response.status === 201){
                alert(result.message);
            }
            else{
                alert(result.message);
            }
        })
    }

    //login form submit
    if (form1) {
        form1.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            //transmit data
            const response = await fetch('/telemedicine/api/doctors/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password}),
                //redirect: "manual"
            })
            console.log(response.headers.get('content-type'));

            const result = await response.json();

            if (response.status === 200){
                //showMessage('success', result.message);
                alert(result.message);
               window.location.href = '/doctor_dashboard'
                
            }
            else{
                //showMessage('failed', result.message);
                alert(result.message);
            }

        });
    }

    async function getDoctor() {
        const doc_first_name = document.getElementById("doc_first_name")
        const doc_last_name = document.getElementById("doc_last_name")
        const doc_schedule = document.getElementById("doc_schedule")
        const doc_email = document.getElementById("doc_email")
        const doc_phone = document.getElementById("doc_phone")

        const response = await fetch('/telemedicine/api/doctors/doctor', {
            method: 'GET'
        });
        if (response.status === 200){
            const result = await response.json()
            doc_first_name.textContent = result.doctor.first_name
            doc_last_name.textContent = result.doctor.last_name
           // doc_schedule.textContent = result.doctor.schedule
            doc_email.textContent = result.doctor.email
            doc_phone.textContent = result.doctor.phone

            doc_schedule.innerHTML = ''; 
            let scheduleArray;  
    try {  
        scheduleArray = JSON.parse(result.doctor.schedule); // Parse the JSON string  
    } catch (error) {  
        console.error('Error parsing schedule:', error);  
        return; // Exit if there's an error in parsing  
    }  

    // Make sure it's an array  
    if (Array.isArray(scheduleArray)) {  
        // Create a <ul> element  
        //const ul = document.createElement('ul');   

        // Iterate through the schedule array  
        scheduleArray.forEach(day => {  
            const span = document.createElement('span');  
            span.textContent = day;  
            doc_schedule.appendChild(span);  
        });  

        // Append the <ul> to the doc_schedule element  
       // doc_schedule.appendChild(ul);  
    } else {  
        console.error('Schedule is not an array:', scheduleArray);  
    }  

        }else{
            console.log(response.message)
        }
    }
    getDoctor();

    if (edit_form){
        edit_form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const checkboxes = document.querySelectorAll('input[name="day"]:checked');
            const selectedDays = [];

            checkboxes.forEach((checkbox) => {
                selectedDays.push(checkbox.value);
            })

            const password = document.getElementById("password").value;
            const password1 = document.getElementById("password1").value;
            const first_name = document.getElementById("first_name").value;
            const last_name = document.getElementById("last_name").value;
            const specialization = document.getElementById("specialization").value;
            const email = document.getElementById("email").value;
            const phone = document.getElementById("phone").value;
            const schedule = selectedDays

            console.log(schedule)

            if (!password === password1) {
                alert("The two passwords must be the same");
                return;
            }
            
            const response = await fetch('/telemedicine/api/doctors/doctor/edit', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({first_name, last_name, specialization, email, phone, schedule, password})
            });

            const result = await response.json();
            if (response.status === 201){
                alert(result.message);
                edit_form.style.display = "none";
            }
            else{
                alert(result.message);
            }
        })
    }

    edit_btn.addEventListener("click", async () =>{
        edit_form.style.display = "block";
    })

    cancel_btn.addEventListener("click", async () => {
        edit_form.style.display = "none";
    })

    //logout
    logout_btn.addEventListener("click", async () =>{
        const response = await fetch('/telemedicine/api/doctors/logout', {
            method: 'GET'
        });
        if (response.status === 200) {
            response.json().then(result =>{
                alert(result.message)
            });
            window.location.href = '/doctor_login'
        } else{
            alert(result.message)
        }
    })

})

function formatDate(dateString){
    const options = {year: 'numeric', month: 'long', day: 'numeric'}
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', options).format(date)
}

const appointment = document.getElementById('doctor-appointments')
const table = document.getElementById('appointment-table')
async function getAppointments() {
    try {
        // Fetch appointments
        const appointment_response = await fetch('/telemedicine/api/doctors/appointments', {
            method: 'GET'
        });

        if (appointment_response.status !== 200) {
            console.error('Failed to fetch appointments');
            return;
        }

        const result = await appointment_response.json();

        // Fetch doctors (only once)
        const patient_response = await fetch('/telemedicine/api/patients/patients', {
            method: 'GET'
        });

        if (patient_response.status !== 200) {
            console.error('Failed to fetch doctors');
            return;
        }

        const patient_result = await patient_response.json();

        // Create a map for quick lookup of doctor names by ID
        const patientMap = {};
        patient_result.patients.forEach(pat => {
            patientMap[pat.patient_id] = `${pat.first_name} ${pat.last_name}`;
        });

        // Populate the appointments table
        result.appointments.forEach(appointment => {
            const table_row = document.createElement('tr');

            // Doctor Name Cell
            const pat_cell = document.createElement('td');
            const patientName = patientMap[appointment.patient_id] || 'Unknown Doctor';
            pat_cell.textContent = patientName;
            table_row.appendChild(pat_cell);

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

getAppointments();