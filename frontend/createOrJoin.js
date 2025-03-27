// Handle the "Create Room" button click
document.getElementById("createRoomBtn").addEventListener("click", function() {
    window.location.href = "createRoom.html"; // Redirect to Create Room page
});

document.getElementById('createRoomBtn').addEventListener('click', function() {
    // Replace 'createroom.html' with the URL you want to navigate to
    window.location.href = 'createroom.html';
});

document.getElementById('joinRoomBtn').addEventListener('click', function() {
    // Replace 'joinroom.html' with the URL you want to navigate to
    window.location.href = 'jra.html';
});

// Handle the "Join Room" button click
document.getElementById("joinRoomBtn").addEventListener("click", function() {
    // Prompt the user for a Room ID
    var roomId = prompt("Please enter the Room ID:");
    
    // Validate if Room ID is entered
    if (roomId) {
        // Redirect to the room page with the Room ID (you can pass this Room ID as a query parameter)
        window.location.href = "joinRoom.html?roomId=" + roomId;
    } else {
        alert("Room ID is required to join the room.");
    }
});