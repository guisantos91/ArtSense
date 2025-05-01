package artsense.backend.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import artsense.backend.services.ArtifactService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import artsense.backend.dto.QuestionRequest;
import artsense.backend.dto.QuestionResponse;
import artsense.backend.models.Artifact;

@RestController
@RequestMapping("/api/v1")
public class ArtifactController {
    private final ArtifactService artifactService;

    public ArtifactController(ArtifactService artifactService) {
        this.artifactService = artifactService;
    }

    @GetMapping("/artifacts/{artifactId}")
    public ResponseEntity<Artifact> getArtifactById(@PathVariable(value="artifactId") Long artifactId) {
        Artifact artifact = artifactService.getArtifactById(artifactId);
        if (artifact == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(artifact, HttpStatus.OK);
    }

    @PostMapping("/artifacts/{artifactId}/question")
    public ResponseEntity<QuestionResponse> postArtifactQuestion(@PathVariable(value="artifactId") Long artifactId, @RequestBody QuestionRequest questionRequest) {
        Artifact artifact = artifactService.getArtifactById(artifactId);
        if (artifact == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        QuestionResponse response = artifactService.getQuestionResponseById(questionRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
