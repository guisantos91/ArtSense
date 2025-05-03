package artsense.backend.services;

import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.awt.Graphics2D;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;

import org.apache.commons.text.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.drew.imaging.ImageMetadataReader;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.exif.ExifIFD0Directory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import artsense.backend.dto.ArtifactInfoTemp;
import artsense.backend.dto.ArtifactPointLabel;
import artsense.backend.dto.LLMPromptResponse;
import artsense.backend.dto.LLMUpload;
import artsense.backend.models.Artifact;
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

    private final OkHttpClient client;

    public LLMService() {
        this.client = new OkHttpClient();
    }

    public LLMPromptResponse promptArtifact(String prompt, Artifact artifact, MultipartFile extraPhoto) throws IOException {
        System.out.println("LLMService: llmPromptResponse called");
        
        String generateContentUrl = apiUrl + "/v1beta/models/" + apiModel + ":generateContent?key=" + apiKey;
        String generateRequestJson = "{ \"contents\": [{ \"parts\": [";
        


        if (extraPhoto != null) {
            System.out.println("Extra photo URL: " + extraPhoto.getOriginalFilename());
            generateRequestJson += "{ \"inline_data\": { \"mime_type\": \"" + extraPhoto.getContentType() + "\", \"data\": \"" + Base64.getEncoder().encodeToString(extraPhoto.getBytes()) + "\" } },";
        }

        generateRequestJson += "{ \"file_data\": { \"mime_type\": \"" + artifact.getLlmMimeType() + "\", \"file_uri\": \"" + artifact.getLlmPhotoUrl() + "\" } },";

        String fullPrompt = "You are a museum guide. " +
            "You are given an optional picture of an artifact and a question about it, that can have some missing information.\n" +
            "Your task is to answer the question based on the optional image and the information you have about the artifact, including the original artifact's image.\n" +
            "Artifact Name: " + artifact.getName() + "\n" +
            "Artifact Description: " + artifact.getDescription() + "\n" +
            "Artifact Original Image URL: (sent as file_data)\n" +
            "Contrainsts:\n" +
            "If the optional image is not provided, you can only use the information you have about the artifact.\n" +
            "If the optional image is provided, you can use it to answer the question.\n" +
            "If the optional image is not related to the artifact, you should ignore it.\n" +
            "If the question is not related to the artifact, you should ignore it.\n" +
            "Answer the question concisely and in 3 to 4 phrases, without subtitles and without any not relevant information (a.k.a. introduction, etc...).\n" +
            "Question: " + prompt;

        generateRequestJson += "{ \"text\": \"" + fullPrompt + "\" }]}],";

        generateRequestJson += "\"tools\": [";
        generateRequestJson += "{ \"google_search\": {} }]}";

        System.out.println("Generated: " + generateRequestJson);

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
            String responseBody = response.body().string();
            System.out.println("Response body: " + responseBody);
            
            
            JsonNode jsonNode = new ObjectMapper().readTree(responseBody);
            String result = jsonNode.path("candidates").get(0).path("groundingMetadata").path("searchEntryPoint").path("renderedContent").asText();
            System.out.println("Html result: " + result);
            
            String unescapedHtml = StringEscapeUtils.unescapeHtml4(result);
            String llmResponse = jsonNode.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

            System.out.println("Unescaped HTML: " + unescapedHtml);
            LLMPromptResponse llmPromptResponse = new LLMPromptResponse(llmResponse, unescapedHtml);

            return llmPromptResponse;
        }        
        
    }
        

    public List<ArtifactPointLabel> locateArtifacts(MultipartFile multipartFile, Map<Long, ArtifactInfoTemp> artifactInfoTemp) throws IOException {
        System.out.println("LLMService: locateArtifacts called");

        String generateContentUrl = apiUrl + "/v1beta/models/" + apiModel + ":generateContent?key=" + apiKey;
        String generateRequestJson = "{ \"contents\": [{ \"parts\": [";

        String prompt = "Ignore everything that you analyzed before.\n Here is the new Reference Artifacts:\n";
    
        for (Map.Entry<Long, ArtifactInfoTemp> entry : artifactInfoTemp.entrySet()) {
            Long artifactId = entry.getKey();
            ArtifactInfoTemp artifactInfo = entry.getValue();
            
            System.out.println("Artifact ID: " + artifactId);
            System.out.println("Artifact Name: " + artifactInfo.getName());
            
            prompt += "- ID: " + artifactId + ", Name: " + artifactInfo.getName() + ", Reference Image URI: " + artifactInfo.getLlmUpload().getLlmPhotoUrl() + "\n";  
            generateRequestJson += "{ \"file_data\": { \"mime_type\": \"" + artifactInfo.getLlmUpload().getLlmMimeType() + "\", \"file_uri\": \"" + artifactInfo.getLlmUpload().getLlmPhotoUrl() + "\" } },";       
        }

        // --- Image Orientation Correction ---
        byte[] originalBytes = multipartFile.getBytes();
        int orientation = readImageOrientation(originalBytes);
        byte[] imageBytesToSend = originalBytes; // Start with original bytes

        if (orientation > 1) {
            try {
                BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(originalBytes));
                if (originalImage != null) {
                    BufferedImage rotatedImage = rotateImage(originalImage, orientation);
                    // Convert rotated image back to bytes
                    ByteArrayOutputStream baos = new ByteArrayOutputStream();
                    String formatName = getFormatName(multipartFile.getContentType());
                    boolean written = ImageIO.write(rotatedImage, formatName, baos);
                    if (written) {
                         imageBytesToSend = baos.toByteArray(); // Use rotated bytes
                         System.out.println("Image successfully rotated and converted back to bytes.");
                    } else {
                         System.err.println("Failed to write rotated image to byte array for format: " + formatName + ". Using original image.");
                    }
                } else {
                     System.err.println("Could not read image bytes into BufferedImage. Using original image.");
                }
            } catch (IOException e) {
                System.err.println("Error during image rotation processing: " + e.getMessage() + ". Using original image.");
            } catch (Exception e) { // Catch unexpected errors during rotation/conversion
                 System.err.println("Unexpected error during image rotation: " + e.getMessage() + ". Using original image.");
            }
        }
        // --- End Orientation Correction ---

        String inlineMimeType = multipartFile.getContentType();
        generateRequestJson += "{ \"inline_data\": { \"mime_type\": \"" + inlineMimeType + "\", \"data\": \"" + Base64.getEncoder().encodeToString(imageBytesToSend) + "\" } },";
        
        prompt += "\nImage to Analyze:\n" +
                  "- Provided via 'inline_data'.\n" +
                  "\nTask:\n" +
                  "1. Your primary goal is to analyze the single 'Image to Analyze' provided via 'inline_data'.\n" +
                  "2. Use the 'Reference Artifacts' images (provided via 'file_data') ONLY as visual references to identify WHICH artifacts to look for within the 'Image to Analyze'.\n" +
                  "3. Detect which of the named 'Reference Artifacts' are present within the 'Image to Analyze'. Do NOT report an artifact if it is only visible in its own 'Reference Artifacts' image but not in the 'Image to Analyze'.\n" +
                  "4. For each artifact that you are 100% sure that was detected *within the 'Image to Analyze'*, provide its center pixel coordinates [x, y]. These coordinates MUST be relative to the 'Image to Analyze' and normalized to a 0-1000 scale for both x and y.\n" +
                  "5. If you are NOT SURE about the detection of an artifact, do NOT include it in the output.\n" +
                  // Reverted JSON example format (no quotes on keys)
                  "6. Return ONLY a VALID JSON object containing the detections regardless of the outcome, DO NOT say anything more.\n" + 
                  "7. Answer with the following format (DO NOT forget the double quotes in the key):\n" +
                  "```json\n" +
                  "{\n" +
                  "  detections: [\n" + // Reverted: no quotes
                  "    {id: artifact-id-1, coordinates: [x1, y1]},\n" + // Reverted: no quotes
                  "    {id: artifact-id-2, coordinates: [x2, y2]},\n" + // Reverted: no quotes
                  "    ...\n" +
                  "  ]\n" +
                  "}\n" +
                  "```\n" +
                  // Reverted JSON example format for empty case
                  "6. If none of the 'Reference Artifacts' are found within the 'Image to Analyze', return exactly:\n" +
                  "```json\n" +
                  "{\n" +
                  "  detections: []\n" + // Reverted: no quotes
                  "}\n" +
                  "```";

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
            String responseBody = response.body().string();
            JsonNode jsonNode = new ObjectMapper().readTree(responseBody);
            String result = jsonNode.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            
            result = result.replace("```json", "").replace("```", "");
            result = result.replaceAll("(?<!\")\\b(detections|id|coordinates)\\b\\s*:", "\"$1\":");
            
            System.out.println("To parse: " + result);

            // Replace single quotes with double quotes for valid JSON
            result = result.replace("'", "\"");

            // Parse the JSON string into a JsonNode
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(result);

            System.out.println("Parsed JSON: " + node.toPrettyString());
            
            JsonNode detectionsNode = node.path("detections");
            List<ArtifactPointLabel> artifactPointLabels = new ArrayList<>();
            
            for (JsonNode detection : detectionsNode) {
                Long artifactId = detection.path("id").asLong();
                JsonNode coordinatesNode = detection.path("coordinates");
                Double x = coordinatesNode.get(0).asDouble();
                Double y = coordinatesNode.get(1).asDouble();
                String name = artifactInfoTemp.get(artifactId).getName();
                
                artifactPointLabels.add(new ArtifactPointLabel(x, y, artifactId, name));
            }

            return artifactPointLabels;
        }

    }
    
    // Google Cloud File API

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

    private int readImageOrientation(byte[] imageBytes) {
        int orientation = 1; // Default: normal orientation
        try (InputStream imageInputStream = new ByteArrayInputStream(imageBytes)) {
            Metadata metadata = ImageMetadataReader.readMetadata(imageInputStream);
            Directory directory = metadata.getFirstDirectoryOfType(ExifIFD0Directory.class);
            if (directory != null && directory.containsTag(ExifIFD0Directory.TAG_ORIENTATION)) {
                orientation = directory.getInt(ExifIFD0Directory.TAG_ORIENTATION);
                System.out.println("Detected EXIF Orientation: " + orientation);
            }
        } catch (ImageProcessingException | IOException | NullPointerException e) { // Added NullPointerException
             // Log the error but proceed with default orientation
            System.err.println("Could not read EXIF metadata or image format issue: " + e.getMessage());
        } catch (Exception e) { // Catch unexpected errors during metadata reading
             System.err.println("Unexpected error reading EXIF metadata: " + e.getMessage());
        }
        return orientation;
    }

    private BufferedImage rotateImage(BufferedImage originalImage, int orientation) {
        if (originalImage == null || orientation <= 1 || orientation > 8) {
            return originalImage; 
        }

        AffineTransform tx = new AffineTransform();
        int width = originalImage.getWidth();
        int height = originalImage.getHeight();
        int newWidth = width;
        int newHeight = height;

        System.out.println("Applying rotation for orientation: " + orientation);

        switch (orientation) {
            case 2: // Flip horizontal
                tx.scale(-1.0, 1.0);
                tx.translate(-width, 0);
                break;
            case 3: // Rotate 180 degrees
                tx.translate(width, height);
                tx.rotate(Math.PI);
                break;
            case 4: // Flip vertical
                tx.scale(1.0, -1.0);
                tx.translate(0, -height);
                break;
            case 5: // Rotate 90 degrees CW and flip vertical
                tx.translate(height, 0);
                tx.rotate(Math.PI / 2);
                tx.scale(1.0, -1.0);
                newWidth = height; newHeight = width;
                break;
            case 6: // Rotate 90 degrees CW
                tx.translate(height, 0);
                tx.rotate(Math.PI / 2);
                newWidth = height; newHeight = width;
                break;
            case 7: // Rotate 270 degrees CW and flip vertical
                tx.translate(0, width);
                tx.rotate(3 * Math.PI / 2);
                tx.scale(1.0, -1.0);
                newWidth = height; newHeight = width;
                break;
            case 8: // Rotate 270 degrees CW
                tx.translate(0, width);
                tx.rotate(3 * Math.PI / 2);
                newWidth = height; newHeight = width;
                break;
            default:
                return originalImage; // No rotation needed
        }

        int imageType = (originalImage.getTransparency() == BufferedImage.TRANSLUCENT) ?
                        BufferedImage.TYPE_INT_ARGB : BufferedImage.TYPE_INT_RGB;
        BufferedImage rotatedImage = new BufferedImage(newWidth, newHeight, imageType);
        Graphics2D g2d = rotatedImage.createGraphics();
        g2d.drawImage(originalImage, tx, null);
        g2d.dispose();

        return rotatedImage;
    }

    private String getFormatName(String contentType) {
        if (contentType == null) return "jpeg"; // Default
        String lowerCaseType = contentType.toLowerCase();
        if (lowerCaseType.contains("jpeg") || lowerCaseType.contains("jpg")) {
            return "jpeg";
        } else if (lowerCaseType.contains("png")) {
            return "png";
        } else if (lowerCaseType.contains("gif")) {
            return "gif";
        } else if (lowerCaseType.contains("bmp")) {
            return "bmp";
        }
        // Add more formats if needed
        return "jpeg"; // Default fallback
    }

}
