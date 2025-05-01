package artsense.backend.services;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Base64;

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

        String generateContentUrl = apiUrl + "/v1beta/models/" + apiModel + ":generateContent?key=" + apiKey;
        String generateRequestJson = "{ \"contents\": [{ \"parts\": [";

        String prompt = "Reference Artifacts:\n";
    
        for (Map.Entry<Long, ArtifactInfoTemp> entry : artifactInfoTemp.entrySet()) {
            Long artifactId = entry.getKey();
            ArtifactInfoTemp artifactInfo = entry.getValue();
            
            System.out.println("Artifact ID: " + artifactId);
            System.out.println("Artifact Name: " + artifactInfo.getName());
            
            prompt += "- ID: " + artifactId + ", Image URI: " + artifactInfo.getLlmUpload().getLlmPhotoUrl() + ", Mime Type: " + artifactInfo.getLlmUpload().getLlmMimeType() + "\n";
            generateRequestJson += "{ \"file_data\": { \"mime_type\": \"" + artifactInfo.getLlmUpload().getLlmMimeType() + "\", \"file_uri\": \"" + artifactInfo.getLlmUpload().getLlmPhotoUrl() + "\" } },";
        }

        String inlineMimeType = multipartFile.getContentType();
        generateRequestJson += "{ \"inline_data\": { \"mime_type\": \"" + inlineMimeType + "\", \"data\": \"" + Base64.getEncoder().encodeToString(multipartFile.getBytes()) + "\" } },";
        
        prompt += "\nTask:\n" +
                "1. Detect which of the reference artifacts are present in the Image to analyze. (the inline picture)\n" +
                "2. For each detected artifact, provide its center pixel coordinates [x, y] in the Image to analyze normalized to 0-1000.\n" +
                "3. Return a JSON object in the following format:\n" +
                "{\n" +
                "  detections: [\n" +
                "    {id: artifact-id-1, coordinates: [x1, y1]},\n" +
                "    {id: artifact-id-2, coordinates: [x2, y2]},\n" +
                "    ...\n" +
                "  ]\n" +
                "}\n" +
                "4. If no reference artifacts are found, return {detections: []}.";

        generateRequestJson += "{ \"text\": \"" + prompt + "\" }]}]}";

        RequestBody generateBody = RequestBody.create(
            generateRequestJson, MediaType.parse("application/json")
        );
    
        Request generateRequest = new Request.Builder()
            .url(generateContentUrl)
            .post(generateBody)
            .build();
    
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

    public LLMUpload uploadFile(String id, String photo, String contentType) throws IOException {
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
        String displayName = id;
        System.out.println("File name: " + id);
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
