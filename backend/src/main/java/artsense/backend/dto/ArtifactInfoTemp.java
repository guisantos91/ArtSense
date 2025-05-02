package artsense.backend.dto;

public class ArtifactInfoTemp {
    private String name;
    private LLMUpload llmUpload;

    public ArtifactInfoTemp(String name, LLMUpload llmUpload) {
        this.name = name;
        this.llmUpload = llmUpload;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LLMUpload getLlmUpload() {
        return llmUpload;
    }

    public void setLlmUpload(LLMUpload llmUpload) {
        this.llmUpload = llmUpload;
    }
}
