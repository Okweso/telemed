//const { response } = require("express");

document.addEventListener('DOMContentLoaded', function() {
    let form = document.getElementById("registerForm");
    const form1 = document.getElementById("loginForm");

    let messageDiv = document.getElementById("message");

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
            console.log(response.headers.get('content-type'));

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

