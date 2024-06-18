// Check if the browser supports the Web Audio API
if (window.AudioContext || window.webkitAudioContext) {
    // Create an audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Set the audio output device to the default device
    const selectedDeviceId = 'default';

    // Set the audio output device for the audio context
    audioContext.setSinkId(selectedDeviceId)
        .then(() => {
            console.log('Audio output set to default device');
        })
        .catch(error => {
            console.error('Error setting audio output:', error);
        });
} else {
    console.error('Web Audio API is not supported');
}

let userAgent = null;
let ringingAudio; // Variable to hold the ringing audio element

// Function to create and play the ringing sound
function playRingingSound() {
    // Create an audio element for the ringing tone
    ringingAudio = new Audio('test.wav');

    // Set audio properties (looping and volume)
    ringingAudio.loop = true; // Loop the ringing tone
    ringingAudio.volume = 0.5; // Adjust the volume as needed

    // Play the ringing tone
    ringingAudio.play()
        .then(() => {
            console.log('Ringing tone playing');
        })
        .catch(error => {
            console.error('Error playing ringing tone:', error);
        });
}

// Function to stop the ringing sound
function stopRingingSound() {
    if (ringingAudio) {
        ringingAudio.pause(); // Pause the ringing tone
        ringingAudio.currentTime = 0; // Reset the audio playback position
        console.log('Ringing tone stopped');
    }
}


document.addEventListener('DOMContentLoaded', (event) => {
    const storedConfiguration = sessionStorage.getItem('userAgent');
    if (storedConfiguration) {
        const configuration = JSON.parse(storedConfiguration);
        userAgent = new SIP.UA(configuration);

        userAgent.on('registered', () => {
            console.log('User agent registered');
        });

        userAgent.on('registrationFailed', () => {
            console.log('User agent registration failed');
            alert('User agent registration failed. Please log in again.');
            window.location.href = 'index.html';
        });

        userAgent.start();
    } else {
        alert('User agent not found. Please log in.');
        window.location.href = 'index.html';
    }
});

function sendDigit(digit) {
    const display = document.getElementById('display-number');
    display.value += digit;
}

function clearDisplay() {
    document.getElementById('display-number').value = '';
}

function removeDigit() {
    const display = document.getElementById('display-number');
    display.value = display.value.slice(0, -1);
}

function makeCall() {
    const phoneNumber = document.getElementById('display-number').value.trim();
    if (!phoneNumber) {
        alert('Please enter a phone number');
        return;
    }
    initiateCall(phoneNumber);
}
function terminateCall() {
    stopRingingSound()
    console.log('Terminating call');
    if (userAgent && userAgent.sessions.length > 0) {
        userAgent.sessions[0].terminate();
    }
}
// Function to initiate the call
function initiateCall(phoneNumber) {
    const session = userAgent.invite(phoneNumber);
    session.on('progress', () => {
        console.log('Call in progress');
    });
    session.on('accepted', () => {
        console.log('Call accepted');
        alert('Call accepted');

        // Stop the ringing sound when the call is accepted
        stopRingingSound();

        // Handle the remote media stream for audio playback
        const remoteStream = session.sessionDescriptionHandler.remoteMediaStream;
        if (remoteStream) {
            // Create an audio element for remote audio playback
            const remoteAudio = new Audio();
            remoteAudio.srcObject = remoteStream;
            remoteAudio.play()
                .then(() => {
                    console.log('Remote audio playing');
                })
                .catch(error => {
                    console.error('Error playing remote audio:', error);
                });
        }
    });
    session.on('failed', () => {
        console.log('Call failed');
        alert('Call failed');
        // Stop the ringing sound when the call fails
        stopRingingSound();
    });
    session.on('terminated', () => {
        console.log('Call terminated');
        // Stop the ringing sound when the call is terminated
        stopRingingSound();
    });
}
