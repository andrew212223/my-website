<?php
// Mock user data
$users = array(
    array("username" => "user1", "password" => "password1"),
    array("username" => "user2", "password" => "password2")
);

// Get form data
$username = $_POST['username'];
$password = $_POST['password'];
$phoneNumber = $_POST['phoneNumber'];

// Authenticate user
$userAuthenticated = false;
foreach ($users as $user) {
    if ($user['username'] === $username && $user['password'] === $password) {
        $userAuthenticated = true;
        break;
    }
}

if (!$userAuthenticated) {
    http_response_code(401);
    echo "Unauthorized";
    exit();
}

// Register the user agent
$callerUsername = $username;
$callerPassword = $password;
$sipServer = 'wss://oxba.voiceflow.co.za:8089/ws';
$callerURI = "sip:$callerUsername@oxba.voiceflow.co.za";

$configuration = array(
    'uri' => $callerURI,
    'wsServers' => $sipServer,
    'authorizationUser' => $callerUsername,
    'password' => $callerPassword,
    'register' => true
);
?>

<script>
    const configuration = <?php echo json_encode($configuration); ?>;
    const userAgent = new SIP.UA(configuration);

    userAgent.start();

    // Listen for registration events
    userAgent.on('registered', () => {
        console.log('User agent registered');
        // Once registered, display the call widget
        document.getElementById('callWidget').style.display = 'block';
    });

    function makeCall() {
        const phoneNumber = document.getElementById('phoneNumber').value;

        // Make sure the phone number is not empty
        if (!phoneNumber) {
            alert('Please enter a phone number');
            return;
        }

        // Initiate the call
        fetch('makecall.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: '<?php echo $username; ?>',
                password: '<?php echo $password; ?>',
                phoneNumber: phoneNumber
            })
        })
        .then(response => {
            if (response.ok) {
                alert('Call initiated!');
            } else {
                alert('Failed to initiate call');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    }
</script>

