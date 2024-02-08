document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
        username: this.username.value,
        password: this.password.value,
    };

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 401) {
                // Handle 401
                return response.json().then(data => {
                    throw new Error(data.message || 'Incorrect password');
                });
            } else {
                // Handle other types of errors
                throw new Error('Login failed');
            }
        })
        .then(data => {
            console.log('Login successful:', data);
            localStorage.setItem('username', formData.username);
            window.location.href = '/chatlist.html';
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message);
        });
});
