package artsense.backend.services;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.net.HttpURLConnection;
import java.net.URL;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.mock.web.MockMultipartFile;

import artsense.backend.dto.ArtifactInfoTemp;
import artsense.backend.dto.LLMUpload;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Component
public class LLMService {
    
    @Value("${llm.api.key}")
    private String apiKey;

    @Value("${llm.api.url}")
    private String apiUrl;

    @Value("${llm.api.model}")
    private String apiModel;

    // tic tac to save the time used
    private long startTime;
    
    private void tic() {
        startTime = System.currentTimeMillis();
    }

    private long tac() {
        return System.currentTimeMillis() - startTime;
    }

    private OkHttpClient client;

    public LLMService() {
        this.client = new OkHttpClient();
    }
    
    public MultipartFile downloadImageAsMultipartFile(String imageUrl, String contentType) throws Exception {
            // Step 1: Open stream from URL
            URL url = new URL(imageUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestProperty("User-Agent", "Mozilla/5.0");
            connection.connect();
            
            try (InputStream inputStream = connection.getInputStream()) {
                System.out.println("Downloading image from URL: " + imageUrl);
                return new MockMultipartFile(
                    "file",                         // name
                    "image.jpg",        // original filename
                    contentType,                         // content type
                    inputStream                          // content stream
                );
            } catch (IOException e) {
                throw new Exception("Failed to download image: " + e.getMessage());
            }
        }

    public String locateArtifacts(MultipartFile multipartFile, Map<Long, ArtifactInfoTemp> artifactInfoTemp) throws IOException {
        System.out.println("LLMService: locateArtifacts called");

        // String geminiPrompt =
        //     "You are an image‐analysis assistant. Given:\n" +
        //     "  • An uploaded photo (binary or base64 image)\n" +
        //     "  • A list of candidate artifacts, each with:\n" +
        //     "      – id: unique identifier\n" +
        //     "      – photoURI: URL or reference to its canonical image\n" +
        //     "      – mimeType: e.g. \"image/jpeg\"\n\n" +
        //     "Task:\n" +
        //     "  1. Detect which of these artifacts appear in the uploaded photo.\n" +
        //     "  2. For each detected artifact, compute the pixel coordinates of its center\n" +
        //     "     in the uploaded image as [x, y].\n" +
        //     "  3. Return exactly one JSON object with a single field \"detections\", whose\n" +
        //     "     value is a list of [x, y, id] triples.\n" +
        //     "  4. If no listed artifact is found, return \"detections\": [].\n\n" +
        //     "Output format (no extra fields, no prose):\n" +
        //     "{\n" +
        //     "  \"detections\": [\n" +
        //     "    [x1, y1, \"artifact-id-1\"],\n" +
        //     "    [x2, y2, \"artifact-id-2\"],\n" +
        //     "    ...\n" +
        //     "  ]\n" +
        //     "}\n\n" +
        //     "Notes:\n" +
        //     "  • Coordinates must be integers.\n" +
        //     "  • Ensure you only reference ids from the provided list.\n" +
        //     "  • Do not include any other keys or commentary.\n";


        String generateContentUrl = apiUrl + "/v1beta/models/" + apiModel + ":generateContent?key=" + apiKey;
        String generateRequestJson = "{ \"contents\": [{ \"parts\": [";
    
        for (Map.Entry<Long, ArtifactInfoTemp> entry : artifactInfoTemp.entrySet()) {
            Long artifactId = entry.getKey();
            ArtifactInfoTemp artifactInfo = entry.getValue();
            
            System.out.println("Artifact ID: " + artifactId);
            System.out.println("Artifact Name: " + artifactInfo.getName());
            // { \\\"file_data\\\":
            generateRequestJson += "{ \"file_data\": { \"mime_type\": \"" + artifactInfo.getLlmUpload().getLlmMimeType() + "\", \"file_uri\": \"" + artifactInfo.getLlmUpload().getLlmPhotoUrl() + "\" } },";
        }

        generateRequestJson += "{ \"text\": \"Caption the images one by one.\" }] }] }";
    
        RequestBody generateBody = RequestBody.create(
            generateRequestJson, MediaType.parse("application/json")
        );

        System.out.println("Generate content Request JSON: " + generateRequestJson);
    
        Request generateRequest = new Request.Builder()
            .url(generateContentUrl)
            .post(generateBody)
            .build();
    
        System.out.println("Curl: curl -X POST " + generateContentUrl + " -H \"Content-Type: application/json\" -d '" + generateRequestJson + "'");

        tic();
        try (Response response = this.client.newCall(generateRequest).execute()) {
            if (!response.isSuccessful()) {
                System.out.println("Body: " + response.body().string());
                System.out.println("Response code: " + response.code());
                System.out.println("Response message: " + response.message());
                System.out.println("Response headers: " + response.headers());
                throw new IOException("Failed to generate content: " + response);
            }
            System.out.println("Time taken to generate content: " + tac() + " ms");

            return response.body().string();
        }

    }

    public LLMUpload uploadFile(String photo, String contentType) throws IOException {
        MultipartFile multipartFile;
        try {
            multipartFile = downloadImageAsMultipartFile(photo, contentType);
        } catch (Exception e) {
            System.out.println("Error downloading image: " + e.getMessage());
            throw new IOException("Failed to download image: " + e.getMessage());
        }

        System.out.println("LLMService: uploadFile called");

        // Step 1: Get file metadata
        String mimeType = multipartFile.getContentType();
        long fileSize = multipartFile.getSize();
        String displayName = "IMAGE";
        System.out.println("File name: " + multipartFile.getOriginalFilename());
        System.out.println("File size: " + fileSize);
        System.out.println("MIME type: " + mimeType);
    
        // Step 2: Start resumable upload
        String startUploadUrl = apiUrl + "/upload/v1beta/files?key=" + apiKey;
        String metadataJson = "{ \"file\": { \"display_name\": \"" + displayName + "\" } }";
    
        System.out.println("Start upload URL: " + startUploadUrl);

        RequestBody metadataBody = RequestBody.create(
            metadataJson, MediaType.parse("application/json")
        );

        System.out.println("Metadata JSON: " + metadataJson);
    
        Request startUploadRequest = new Request.Builder()
            .url(startUploadUrl)
            .addHeader("X-Goog-Upload-Protacol", "resumable")
            .addHeader("X-Goog-Upload-Command", "start")
            .addHeader("X-Goog-Upload-Header-Content-Length", String.valueOf(fileSize))
            .addHeader("X-Goog-Upload-Header-Content-Type", mimeType)
            .post(metadataBody)
            .build();

        System.out.println("Start upload request: " + startUploadRequest);
    
        // String uploadUrl;
        // try (Response response = this.client.newCall(startUploadRequest).execute()) {
        //     if (!response.isSuccessful()) {
        //         throw new IOException("Failed to start upload: " + response);
        //     }
        //     uploadUrl = response.header("X-Goog-Upload-URL");
        //     if (uploadUrl == null) {
        //         System.out.println("Response: " + response);
        //         System.out.println("Response headers: " + response.headers());
        //         throw new IOException("Upload URL not found in response headers.");
        //     }
        // }
        String uploadUrl = startUploadUrl;

        System.out.println("Upload URL: " + uploadUrl);
    
        // Step 3: Upload the file
        RequestBody fileBody = RequestBody.create(
            multipartFile.getBytes(), MediaType.parse(mimeType)
        );
    
        Request uploadRequest = new Request.Builder()
            .url(uploadUrl)
            .addHeader("Content-Length", String.valueOf(fileSize))
            .addHeader("X-Goog-Upload-Offset", "0")
            .addHeader("X-Goog-Upload-Command", "upload, finalize")
            .post(fileBody)
            .build();
    
        String fileUri;
        tic();
        try (Response response = this.client.newCall(uploadRequest).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Failed to upload file: " + response);
            }
            String responseBody = response.body().string();
            fileUri = new com.fasterxml.jackson.databind.ObjectMapper()
                .readTree(responseBody)
                .path("file")
                .path("uri")
                .asText();
        }
        System.out.println("Time taken to upload: " + tac() + " ms");

        System.out.println("File URI: " + fileUri);

        return new LLMUpload(fileUri, mimeType);
    }


}
