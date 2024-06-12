// script.js 
    let userAgent; 
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
function register(username, password) {
    const sipServer = 'wss://oxba.voiceflow.co.za:8089/ws'; // Replace with your SIP server details
    const callerURI = 'sip:1018@oxba.voiceflow.co.za'; // Replace with your SIP username and domain
    const configuration = {
        uri: callerURI,
        transportOptions: {
	wsServers: [ 'wss://oxba.voiceflow.co.za:8089/ws'  ],
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
function initiateCall(phoneNumber) {
    const session = userAgent.invite(phoneNumber);
    session.on('progress', () => {
        console.log('Call in progress');
    });
    session.on('accepted', () => {
        console.log('Call accepted');
        alert('Call accepted');
    });
    session.on('failed', () => {
        console.log('Call failed');
        alert('Call failed');
    });
    session.on('terminated', () => {
        console.log('Call terminated');
    });
}
