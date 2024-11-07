// Function to get geolocation and postal code based on IP address
function getGeolocationAndPostalCode() {
    // Use an IP-based geolocation API to get location data
    fetch('https://ipinfo.io/json?token=YOUR_API_TOKEN_HERE')
        .then(response => response.json())
        .then(data => {
            const { ip, city, region, country, postal, loc } = data;
            const [latitude, longitude] = loc.split(',');

            console.log(`IP Address: ${ip}`);
            console.log(`City: ${city}`);
            console.log(`Region: ${region}`);
            console.log(`Country: ${country}`);
            console.log(`Postal Code: ${postal}`);
            console.log(`Latitude: ${latitude}`);
            console.log(`Longitude: ${longitude}`);
        })
        .catch(error => {
            console.error('Error fetching geolocation data:', error);
        });
}

// Get Device Memory
function getDeviceMemory() {
    if ('deviceMemory' in navigator) {
        console.log(`Device Memory: ${navigator.deviceMemory} GB`);
    } else {
        console.log("Device memory information is not available.");
    }
}

// Get Connection Type
function getConnectionType() {
    if ('connection' in navigator) {
        console.log(`Connection Type: ${navigator.connection.effectiveType}`);
        console.log(`Connection Speed: ${navigator.connection.downlink} Mbps`);
        console.log(`Connection Latency: ${navigator.connection.rtt} ms`);
    } else {
        console.log("Connection type is not supported.");
    }
}

// Get Screen Information
function getScreenInfo() {
    console.log(`Screen Resolution: ${window.screen.width}x${window.screen.height}`);
    console.log(`Color Depth: ${window.screen.colorDepth} bits`);
    console.log(`Pixel Ratio: ${window.devicePixelRatio}`);
}

// Check if Cookies are Enabled
function checkCookies() {
    if (navigator.cookieEnabled) {
        console.log("Cookies are enabled.");
    } else {
        console.log("Cookies are disabled.");
    }
}

// Get Timezone Information
function getTimezone() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(`Timezone: ${timezone}`);
}

// Check Local Storage Support
function checkLocalStorage() {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        console.log("Local Storage is supported.");
    } catch (e) {
        console.log("Local Storage is not supported.");
    }
}

// Collect Browser and OS Info
function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browserName = "Unknown";
    let osName = "Unknown";
    
    if (userAgent.indexOf("Chrome") > -1) {
        browserName = "Chrome";
    } else if (userAgent.indexOf("Firefox") > -1) {
        browserName = "Firefox";
    } else if (userAgent.indexOf("Safari") > -1) {
        browserName = "Safari";
    } else if (userAgent.indexOf("Edge") > -1) {
        browserName = "Edge";
    }

    if (userAgent.indexOf("Windows NT") > -1) {
        osName = "Windows";
    } else if (userAgent.indexOf("Mac OS X") > -1) {
        osName = "Mac OS";
    } else if (userAgent.indexOf("Linux") > -1) {
        osName = "Linux";
    } else if (userAgent.indexOf("Android") > -1) {
        osName = "Android";
    } else if (userAgent.indexOf("iPhone") > -1) {
        osName = "iOS";
    }

    console.log(`Browser: ${browserName}`);
    console.log(`Operating System: ${osName}`);
}

// Detect JavaScript Engine
function detectJsEngine() {
    if (window.hasOwnProperty('chrome')) {
        console.log('JavaScript Engine: V8');
    } else if (window.hasOwnProperty('moz')) {
        console.log('JavaScript Engine: SpiderMonkey');
    } else {
        console.log('JavaScript Engine: Unknown');
    }
}

// Detect Browser Engine
function detectBrowserEngine() {
    if (navigator.userAgent.includes('WebKit')) {
        console.log('Browser Engine: WebKit');
    } else if (navigator.userAgent.includes('Gecko')) {
        console.log('Browser Engine: Gecko');
    } else if (navigator.userAgent.includes('Blink')) {
        console.log('Browser Engine: Blink');
    } else {
        console.log('Browser Engine: Unknown');
    }
}

// Check for Screen Orientation Change
function detectOrientationChange() {
    window.addEventListener('orientationchange', function() {
        if (window.orientation === 0) {
            console.log("Device is in Portrait mode");
        } else if (window.orientation === 90 || window.orientation === -90) {
            console.log("Device is in Landscape mode");
        }
    });
}

// Check Clipboard API Support
function checkClipboard() {
    if (navigator.clipboard) {
        console.log("Clipboard API is supported.");
    } else {
        console.log("Clipboard API is not supported.");
    }
}

// Detect Service Workers
function checkServiceWorker() {
    if ('serviceWorker' in navigator) {
        console.log("Service Worker is supported.");
    } else {
        console.log("Service Worker is not supported.");
    }
}

// Check WebSocket Support
function checkWebSocket() {
    if ('WebSocket' in window) {
        console.log("WebSocket is supported.");
    } else {
        console.log("WebSocket is not supported.");
    }
}

// Check Fetch API Support
function checkFetch() {
    if ('fetch' in window) {
        console.log("Fetch API is supported.");
    } else {
        console.log("Fetch API is not supported.");
    }
}

// Check IndexedDB Support
function checkIndexedDB() {
    if ('indexedDB' in window) {
        console.log("IndexedDB is supported.");
    } else {
        console.log("IndexedDB is not supported.");
    }
}

// Collect and Log All Information
function collectAllInfo() {
    getGeolocationAndPostalCode();
    getDeviceMemory();
    getConnectionType();
    getScreenInfo();
    checkCookies();
    getTimezone();
    checkLocalStorage();
    getBrowserInfo();
    detectJsEngine();
    detectBrowserEngine();
    detectOrientationChange();
    checkClipboard();
    checkServiceWorker();
    checkWebSocket();
    checkFetch();
    checkIndexedDB();
}

collectAllInfo();
