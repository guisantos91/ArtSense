package artsense.backend.services;

import artsense.backend.repositories.ArtifactRepository;

import org.springframework.stereotype.Service;

import artsense.backend.dto.QuestionRequest;
import artsense.backend.dto.QuestionResponse;
import artsense.backend.models.Artifact;

@Service
public class ArtifactService {
    
    private final ArtifactRepository artifactRepository;

    public ArtifactService(ArtifactRepository artifactRepository) {
        this.artifactRepository = artifactRepository;
    }

    public Artifact getArtifactById(Long id) {
        return artifactRepository.findById(id).orElse(null);
    }

    public QuestionResponse getQuestionResponseById(QuestionRequest question) {
        // TODO: implement
        return new QuestionResponse("Not ai processed question yet..", "Not ai answer yet..");
    }

}
