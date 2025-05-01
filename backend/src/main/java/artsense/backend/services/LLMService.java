package artsense.backend.services;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

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

    public String locateArtifacts(MultipartFile multipartFile) throws IOException {
        System.out.println("LLMService: locateArtifacts called");
        OkHttpClient client = new OkHttpClient();

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

        //https://generativelanguage.googleapis.com/upload/v1beta/files
        //https://generativelanguage.googleapis.com/v1beta/models/upload/v1beta/files?key=AIzaSyC2wqvqjHiegnGd9C-vRIdLrr-yDKXw3BQ
    
        Request startUploadRequest = new Request.Builder()
            .url(startUploadUrl)
            .addHeader("X-Goog-Upload-Protocol", "resumable")
            .addHeader("X-Goog-Upload-Command", "start")
            .addHeader("X-Goog-Upload-Header-Content-Length", String.valueOf(fileSize))
            .addHeader("X-Goog-Upload-Header-Content-Type", mimeType)
            .post(metadataBody)
            .build();
    
        String uploadUrl;
        try (Response response = client.newCall(startUploadRequest).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Failed to start upload: " + response);
            }
            uploadUrl = response.header("X-Goog-Upload-URL");
            if (uploadUrl == null) {
                throw new IOException("Upload URL not found in response headers.");
            }
        }

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
        try (Response response = client.newCall(uploadRequest).execute()) {
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

        System.out.println("File URI: " + fileUri);
    
        // Step 4: Generate content using the uploaded file
        String generateContentUrl = apiUrl + "/v1beta/models/" + apiModel + ":generateContent?key=" + apiKey;
        String generateRequestJson = "{ \"contents\": [{ \"parts\": ["
            + "{ \"file_data\": { \"mime_type\": \"" + mimeType + "\", \"file_uri\": \"" + fileUri + "\" } },"
            + "{ \"text\": \"Caption this image.\" }"
            + "] }] }";
    
        RequestBody generateBody = RequestBody.create(
            generateRequestJson, MediaType.parse("application/json")
        );
    
        Request generateRequest = new Request.Builder()
            .url(generateContentUrl)
            .post(generateBody)
            .build();
    
        try (Response response = client.newCall(generateRequest).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Failed to generate content: " + response);
            }
            return response.body().string();
        }

    }

}
