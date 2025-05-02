package artsense.backend.services;

import artsense.backend.repositories.ArtifactRepository;

import java.io.IOException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import artsense.backend.dto.LLMPromptResponse;
import artsense.backend.dto.QuestionRequest;
import artsense.backend.dto.QuestionResponse;
import artsense.backend.models.Artifact;

@Service
public class ArtifactService {
    
    private final ArtifactRepository artifactRepository;
    private final LLMService llmService;

    public ArtifactService(ArtifactRepository artifactRepository, LLMService llmService) {
        this.artifactRepository = artifactRepository;
        this.llmService = llmService;
    }

    public Artifact getArtifactById(Long id) {
        return artifactRepository.findById(id).orElse(null);
    }

    public LLMPromptResponse promtArtifact(String prompt, Long artifactId, MultipartFile extraPhoto) throws IOException {
        Artifact artifact = artifactRepository.findById(artifactId).orElse(null);
        if (artifact == null) {
            return null;
        }

        LLMPromptResponse responseBody = llmService.promptArtifact(prompt, artifact, extraPhoto);

        return responseBody;
    }

    public QuestionResponse getQuestionResponseById(QuestionRequest question) {
        // TODO: implement
        return new QuestionResponse("Not ai processed question yet..", "Not ai answer yet..");
    }

}
