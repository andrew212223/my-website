// Global variable to hold the timer interval ID
var timerInterval;

// Function to start the timer
function startTimer() {
    var timerElement = document.getElementById('call-time');
    var startTime = new Date().getTime();

    timerInterval = setInterval(function() {
        var currentTime = new Date().getTime();
        var elapsedTime = currentTime - startTime;
        var minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
        var seconds = Math.floor((elapsedTime / 1000) % 60);

        // Format the time as MM:SS
        var formattedTime = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
        timerElement.textContent = formattedTime;
    }, 1000); // Update every second
}

// Function to stop the timer
function stopTimer() {
    clearInterval(timerInterval);
}

// Function to handle hangup button click
function hangupCall() {
    alert('Call ended');
    stopTimer(); // Stop the timer
    // You can add additional logic here, such as redirecting to a different page
}

// Function to handle mute button click
function toggleMute() {
    var muteBtn = document.getElementById('mute-btn');
    var icon = muteBtn.innerHTML; // Get the current button content

    // Toggle between mute and unmute
    if (icon === 'Mute') {
        muteBtn.innerHTML = '<i class="fa fa-volume-off" aria-hidden="true"></i>'; // Display mute icon
    } else {
        muteBtn.innerHTML = 'Mute'; // Display unmute text
    }
}

// Function to handle hold button click
function toggleHold() {
    var holdBtn = document.getElementById('hold-btn');
    var icon = holdBtn.innerHTML; // Get the current button content

    // Toggle between hold and unhold
    if (icon === 'Hold') {
        holdBtn.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>'; // Display hold icon
    } else {
        holdBtn.innerHTML = 'Hold'; // Display unhold text
    }
}

// Function to handle transfer button click
function transferCall() {
    alert('Transfer button clicked!');
    // You can add additional logic here for call transfer
}

// Function to handle button click events
function setupButtonActions() {
    var holdBtn = document.getElementById('hold-btn');
    var muteBtn = document.getElementById('mute-btn');
    var transferBtn = document.getElementById('transfer-btn');
    var endCallBtn = document.getElementById('end-call-btn');

    // Example action for each button
    holdBtn.addEventListener('click', toggleHold);
    muteBtn.addEventListener('click', toggleMute);
    transferBtn.addEventListener('click', transferCall);
    endCallBtn.addEventListener('click', hangupCall);
}

// Call the functions when the page loads
document.addEventListener('DOMContentLoaded', function() {
    startTimer(); // Start the timer
    setupButtonActions(); // Setup button click actions
});
