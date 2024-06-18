// Check if the browser supports the Web Audio API
if (window.AudioContext || window.webkitAudioContext) {
    // Create an audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Get a list of available audio output devices
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const outputDevices = devices.filter(device => device.kind === 'audiooutput');
            console.log('Available output devices:', outputDevices);

            // Select a specific output device (e.g., first device in the list)
            if (outputDevices.length > 0) {
                const selectedDeviceId = outputDevices[0].deviceId;
                console.log('Selected output device:', selectedDeviceId);

                // Set the audio output device for the audio context
                audioContext.setSinkId(selectedDeviceId)
                    .then(() => {
                        console.log('Audio output set to selected device');
                    })
                    .catch(error => {
                        console.error('Error setting audio output:', error);
                    });
            }
        })
        .catch(error => {
            console.error('Error enumerating devices:', error);
        });
} else {
    console.error('Web Audio API is not supported');
}

// Now, continue with your existing functions and logic related to SIP calling and audio playback

let userAgent;
let ringingAudio; // Variable to hold the ringing audio element

// Function to create and play the ringing sound
function playRingingSound() {
    // Create an audio element for the ringing tone
    ringingAudio = new Audio('path_to_your_ringing_audio_file.mp3');

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

// Function to register the user and initiate the call
function registerUser(event) {
    event.preventDefault(); // Prevent the default form submission
    // Get the form inputs
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    // Perform basic validation
    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }
    // Perform the registration process
    register(username, password);
}

// Function to register with the SIP server
function register(username, password) {
    const sipServer = 'wss://oxba.voiceflow.co.za:8089/ws'; // Replace with your SIP server details
    const callerURI = 'sip:1018@oxba.voiceflow.co.za'; // Replace with your SIP username and domain
    const configuration = {
        uri: callerURI,
        transportOptions: {
            wsServers: ['wss://oxba.voiceflow.co.za:8089/ws'],
        },
        authorizationUser: username,
        password: password,
        register: true
    };
    userAgent = new SIP.UA(configuration);
    // Listen for registration events
    userAgent.on('registered', () => {
        console.log('User agent registered');
        // Once registered, display the call widget
        document.getElementById('registrationForm').style.display = 'none';
        document.getElementById('callWidget').style.display = 'block';
    });
    // Listen for registration failure events
    userAgent.on('registrationFailed', () => {
        console.log('User agent registration failed');
        alert('User agent registration failed. Please check your credentials and try again.');
    });
    userAgent.start();
}

// Function to initiate the call
function initiateCall(phoneNumber) {
    const session = userAgent.invite(phoneNumber);
    session.on('progress', () => {
        console.log('Call in progress');
        // Play the ringing sound when the call is in progress
        playRingingSound();
    });
    session.on('accepted', () => {
        console.log('Call accepted');
        alert('Call accepted');
        // Stop the ringing sound when the call is accepted
        stopRingingSound();
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

// Function to make the call when the button is clicked
function makeCall() {
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    // Make sure the phone number is not empty
    if (!phoneNumber) {
        alert('Please enter a phone number');
        return;
    }
    // Initiate the call
    initiateCall(phoneNumber);
}

// Event listener for the form submission
document.getElementById('registrationForm').addEventListener('submit', registerUser);

// Event listener for the call button click
document.getElementById('callButton').addEventListener('click', makeCall);
