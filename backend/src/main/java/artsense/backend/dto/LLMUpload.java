package artsense.backend.dto;

public class LLMUpload {
    private String llmPhotoUrl;
    private String llmMimeType;

    public LLMUpload(String llmPhotoUrl, String llmMimeType) {
        this.llmPhotoUrl = llmPhotoUrl;
        this.llmMimeType = llmMimeType;
    }

    public String getLlmPhotoUrl() {
        return llmPhotoUrl;
    }

    public void setLlmPhotoUrl(String llmPhotoUrl) {
        this.llmPhotoUrl = llmPhotoUrl;
    }

    public String getLlmMimeType() {
        return llmMimeType;
    }

    public void setLlmMimeType(String llmMimeType) {
        this.llmMimeType = llmMimeType;
    }
}
