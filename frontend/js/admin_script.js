document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('admin-register');
    form1 = document.getElementById('login-form');

    if (form){
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            username = document.getElementById('username').value
            role = document.getElementById('role').value
            password = document.getElementById('password').value
            password1 = document.getElementById('password1').value

            if (!password === password1){
                alert('Passwords must be the same')
                return;
            }

            const response = await fetch('/telemedicine/api/admins/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, role, password})

            })
            const result = await response.json()
            if (result.status === 201){
                alert(result.message)
            }
            else{
                alert(result.message)
            }
        })
    }

    if (form1){
        form1.addEventListener('submit', async (e) =>{
            e.preventDefault();

            username = document.getElementById('login-username')
            password = document.getElementById('login-password')

            const response = await fetch('/telemedicine/api/admins/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password})
            })
            const result = await response.json()
            if (result.status === 200){
                alert(result.message)
                window.location.href = '/admin_page.html'
            }
            else{
                alert(result.message)
            }
        })
    }
})