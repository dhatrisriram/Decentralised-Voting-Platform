document.getElementById("createAccountForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Assuming form validation here, such as checking if passwords match
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirm-password").value;
    
    if (password !== confirmPassword) {
        document.getElementById("error-message").textContent = "Passwords do not match!";
    } else {
        // Simulate account creation process (you would typically send this data to a server)
        alert("Account created successfully!");

        // Redirect to the login page after successful account creation
        window.location.href = "1.login.html";
    }
});
