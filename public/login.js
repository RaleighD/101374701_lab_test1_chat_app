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
            console.log('Login successful:', data); // This line helps you see the response structure
            // Example adjustment based on expected data structure
            // Make sure to adjust this line based on how your server response is structured
            localStorage.setItem('username', formData.username); // or data.user.username if nested
            window.location.href = '/chatlist.html'; // Redirect to chat list page
        })
        .catch(error => {
            console.error('Error:', error);
        });
});