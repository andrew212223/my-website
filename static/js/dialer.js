let userAgent = null;

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

function initiateCall(phoneNumber) {
    console.log('Initiating call to', phoneNumber);
    const session = userAgent.invite(phoneNumber);
    session.on('progress', () => {
        console.log('Call in progress');
    });
    session.on('accepted', () => {
        console.log('Call accepted');
        alert('Call accepted');
    });
    session.on('failed', (data) => {
        console.log('Call failed with reason:', data.reason);
        alert('Call failed: ' + data.reason);
    });
    session.on('terminated', () => {
        console.log('Call terminated');
    });
}
