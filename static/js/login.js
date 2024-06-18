let userAgent = null;

function registerUser(event) {
    event.preventDefault(); // Prevent the default form submission

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }

    const sipServer = 'wss://oxba.voiceflow.co.za:8089/ws';
    const callerURI = `sip:${username}@oxba.voiceflow.co.za`;
    const configuration = {
        uri: callerURI,
        transportOptions: {
            wsServers: [sipServer],
        },
        authorizationUser: username,
        password: password,
        register: true,
    };

    userAgent = new SIP.UA(configuration);

    userAgent.on('registered', () => {
        console.log('User agent registered');
        // Store userAgent in sessionStorage to persist across pages
        sessionStorage.setItem('userAgent', JSON.stringify(configuration));
        // Redirect to dial page
        window.location.href = 'dial.html';
    });

    userAgent.on('registrationFailed', () => {
        console.log('User agent registration failed');
        alert('User agent registration failed. Please check your credentials and try again.');
    });

    userAgent.start();
}
