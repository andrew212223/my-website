// Function to send digit to display
function sendDigit(digit) {
    var display = document.getElementById('display-number');
    display.value += digit;
}

// Function to remove the last digit from display
function removeDigit() {
    var display = document.getElementById('display-number');
    display.value = display.value.slice(0, -1);
}

// Function to clear the display
function clearDisplay() {
    var display = document.getElementById('display-number');
    display.value = '';
}

// Function to simulate making a call
// Function to simulate making a call
function call() {
    var display = document.getElementById('display-number').value;
    if (display.trim() !== '') {
        // Redirect to call in progress page
        window.location.href = '/call-in-progress';
    } else {
        alert('Please enter a valid number to call.');
    }
}
