// Add event listener to the login button
// document.getElementById("loginBtn").addEventListener("submit", function(event) {
//     event.preventDefault(); // Prevent form submission and page reload

    // Assuming you validate the login (you can add your login logic here)

    // Redirect to "Create or Join Room" page after successful login
    document.getElementById('loginBtn').addEventListener('click', function() {
        // Replace 'joinroom.html' with the URL you want to navigate to
        window.location.href = 'createOrJoin.html';
    });

