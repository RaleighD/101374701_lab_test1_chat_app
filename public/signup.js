document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission

    // form data
    const formData = {
        username: this.username.value,
        firstname: this.firstname.value,
        lastname: this.lastname.value,
        password: this.password.value,
    };

    // Send data to server
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});