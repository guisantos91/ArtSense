package artsense.backend.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.http.ResponseEntity;

import artsense.backend.services.ExhibitionService;
import artsense.backend.services.MuseumService;
import artsense.backend.dto.MuseumView;
import artsense.backend.dto.ExhibitionCardView;
import artsense.backend.dto.MuseumCardView;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1")  
public class MuseumController {
    private final MuseumService museumService;
    private final ExhibitionService exhibitionService;

    public MuseumController(MuseumService museumService, ExhibitionService exhibitionService) {
        this.museumService = museumService;
        this.exhibitionService = exhibitionService;
    }

    @GetMapping("/museums")
    public ResponseEntity<List<MuseumCardView>> getAllMuseums(@RequestParam(value="museumStartsWith", required=false) String museumStartsWith) {
        List<MuseumCardView> museums = museumService.getAllMuseums(museumStartsWith);
        return new ResponseEntity<>(museums, HttpStatus.OK);
    }

    @GetMapping("/museums/{museumId}")
    public ResponseEntity<MuseumView> getMuseumById(@PathVariable(value="museumId") Long museumId) {
        MuseumView museum = museumService.getMuseumById(museumId);
        if (museum == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(museum, HttpStatus.OK);
    }

    @GetMapping("/museums/{museumId}/exhibitions")
    public ResponseEntity<List<ExhibitionCardView>> getExhibitionsByMuseumIdByCurrentDate(@PathVariable(value="museumId") Long museumId, @RequestParam(value="exhibitionStartsWith", required=false) String exhibitionStartsWith) {
        LocalDateTime currentDate = LocalDateTime.now();
        List<ExhibitionCardView> exhibitions = exhibitionService.getExhibitionsByMuseumIdByCurrentDate(museumId, currentDate, exhibitionStartsWith);
        return new ResponseEntity<>(exhibitions, HttpStatus.OK);
    }

}
