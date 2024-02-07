// Check if the login form exists on the current page before adding the event listener
if (document.getElementById('loginForm')) {
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
                    return response.json(); // Assuming the server responds with JSON
                }
                throw new Error('Login failed');
            })
            .then(data => {
                console.log('Login successful:', data);
                window.location.href = '/chatlist.html'; // Redirect to chat list page
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
}
