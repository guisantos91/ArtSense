package artsense.backend.controllers;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import artsense.backend.dto.ArtifactPointLabel;
import artsense.backend.dto.ExhibitionCardView;
import artsense.backend.dto.ExhibitionCardWithMuseum;
import artsense.backend.dto.ExhibitionIngressView;
import artsense.backend.dto.ExhibitionView;
import artsense.backend.models.Exhibition;
import artsense.backend.services.ExhibitionService;

@RestController
@RequestMapping("/api/v1")
public class ExhibitionController {
    private final ExhibitionService exhibitionService;

    public ExhibitionController(ExhibitionService exhibitionService) {
        this.exhibitionService = exhibitionService;
    }

    @GetMapping("/exhibitions")
    public ResponseEntity<List<ExhibitionCardWithMuseum>> getAllExhibitions(@RequestParam(value="museumStartsWith", required=false) String museumStartsWith) {
        List<ExhibitionCardWithMuseum> exhibitions = exhibitionService.getAllExhibitions(museumStartsWith);
        return new ResponseEntity<>(exhibitions, HttpStatus.OK);
    }

    @GetMapping("/exhibitions/{exhibitionId}")
    public ResponseEntity<ExhibitionView> getExhibitionById(@PathVariable(value="exhibitionId") Long exhibitionId) {
        ExhibitionView exhibition = exhibitionService.getExhibitionById(exhibitionId);
        if (exhibition == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(exhibition, HttpStatus.OK);
    }

    @PostMapping("/exhibitions/ingress")
    public ResponseEntity<Exhibition> createExhibition(@RequestBody ExhibitionIngressView exhibitionIngressView) {
        Exhibition createdExhibition = exhibitionService.checkIngress(exhibitionIngressView);
        if (createdExhibition == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(createdExhibition, HttpStatus.OK);
    }

    @PostMapping(path="/exhibitions/{exhibitionId}/locate-artifacts", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<ArtifactPointLabel>> locateArtifacts(@PathVariable(value="exhibitionId") Long exhibitionId, @RequestPart("image") MultipartFile image) throws IOException {
        List<ArtifactPointLabel> artifactPointLabels = exhibitionService.locateArtifacts(exhibitionId, image);
        if (artifactPointLabels == null || artifactPointLabels.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(artifactPointLabels, HttpStatus.OK);
    }
    
}
