import oshi.SystemInfo;
import oshi.hardware.CentralProcessor;
import oshi.hardware.GlobalMemory;
import oshi.hardware.HardwareAbstractionLayer;
import oshi.hardware.PowerSource;
import oshi.software.os.OperatingSystem;
import oshi.software.os.OperatingSystemVersion;
import oshi.util.FormatUtil;

import javax.net.ssl.HttpsURLConnection;
import java.io.OutputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class SystemInfoToDiscord {

    private static final String DISCORD_WEBHOOK_URL = "YOUR_DISCORD_WEBHOOK_URL";

    public static void main(String[] args) {
        SystemInfo systemInfo = new SystemInfo();
        HardwareAbstractionLayer hardware = systemInfo.getHardware();
        OperatingSystem os = systemInfo.getOperatingSystem();

        StringBuilder systemDetails = new StringBuilder();

        // OS Information
        OperatingSystemVersion osVersion = os.getVersion();
        systemDetails.append("**Operating System**: ").append(os).append(" ").append(osVersion).append("\n");

        // CPU Information
        CentralProcessor processor = hardware.getProcessor();
        systemDetails.append("**CPU Model**: ").append(processor.getProcessorIdentifier().getName()).append("\n");
        systemDetails.append("**CPU Cores**: ").append(processor.getLogicalProcessorCount()).append("\n");

        // Memory Information
        GlobalMemory memory = hardware.getMemory();
        systemDetails.append("**Total Memory**: ").append(FormatUtil.formatBytes(memory.getTotal())).append("\n");
        systemDetails.append("**Available Memory**: ").append(FormatUtil.formatBytes(memory.getAvailable())).append("\n");

        // Battery Information
        List<PowerSource> powerSources = hardware.getPowerSources();
        if (!powerSources.isEmpty()) {
            PowerSource battery = powerSources.get(0);
            systemDetails.append("**Battery Status**: ").append(battery.getName()).append("\n");
            systemDetails.append("**Battery Capacity**: ").append((int) (battery.getRemainingCapacity() * 100)).append("%\n");
            systemDetails.append("**Charging**: ").append(battery.isCharging() ? "Yes" : "No").append("\n");
        } else {
            systemDetails.append("**Battery Status**: No battery detected.\n");
        }

        // System Uptime
        systemDetails.append("**System Uptime**: ").append(FormatUtil.formatElapsedSecs(hardware.getProcessor().getSystemUptime())).append("\n");

        // Send to Discord
        sendToDiscord(systemDetails.toString());
    }

    private static void sendToDiscord(String content) {
        try {
            URL url = new URL(DISCORD_WEBHOOK_URL);
            HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);

            // JSON Payload
            String jsonPayload = "{\"content\":\"" + content.replace("\"", "\\\"") + "\"}";

            try (OutputStream os = connection.getOutputStream()) {
                byte[] input = jsonPayload.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpsURLConnection.HTTP_OK) {
                System.out.println("Successfully sent system information to Discord.");
            } else {
                System.err.println("Failed to send system information. Response Code: " + responseCode);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
