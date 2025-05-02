package artsense.backend.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;

import artsense.backend.services.ArtifactService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import artsense.backend.dto.ArtifactPointLabel;
import artsense.backend.dto.LLMPromptResponse;
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

    @PostMapping(path="/artifacts/{artifactId}/prompt", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<LLMPromptResponse> locateArtifacts(@PathVariable(value="artifactId") Long artifactId, String prompt, @RequestPart(value = "extraPhoto", required = false) MultipartFile extraPhoto) throws IOException {
        LLMPromptResponse response = artifactService.promtArtifact(prompt, artifactId, extraPhoto);
        if (response == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
