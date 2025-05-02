package artsense.backend.services;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import artsense.backend.dto.ArtifactInfoTemp;
import artsense.backend.dto.ArtifactPointLabel;
import artsense.backend.dto.ExhibitionCardView;
import artsense.backend.dto.ExhibitionCardWithMuseum;
import artsense.backend.dto.ExhibitionIngressView;
import artsense.backend.dto.ExhibitionView;
import artsense.backend.dto.LLMUpload;
import artsense.backend.models.Exhibition;
import artsense.backend.repositories.ExhibitionRepository;

@Service
public class ExhibitionService {
    private final ExhibitionRepository exhibitionRepository;
    private final LLMService llmService;

    public ExhibitionService(ExhibitionRepository exhibitionRepository, LLMService llmService) {
        this.exhibitionRepository = exhibitionRepository;
        this.llmService = llmService;
    }

    public List<ExhibitionCardView> getAllExhibitions() {
        List<Exhibition> exhibitions = exhibitionRepository.findAll();
        return exhibitions.stream()
                .map(exhibition -> new ExhibitionCardView(
                        exhibition.getExhibitionId(),
                        exhibition.getName(),
                        exhibition.getStartDate(),
                        exhibition.getEndDate(),
                        exhibition.getPhotoUrl()
                ))
                .toList();
    }

    public List<ExhibitionCardView> getExhibitionsByMuseumIdByCurrentDate(Long museumId, LocalDateTime currentDate) {
        return exhibitionRepository.findByMuseum_MuseumIdAndStartDateLessThanEqualAndEndDateGreaterThanEqualOrderByStartDateAsc(museumId, currentDate, currentDate);
    } 

    public List<ExhibitionCardWithMuseum> getExhibitionsByMuseumId(Long museumId) {
        return exhibitionRepository.findByMuseum_MuseumId(museumId);
    }

    public ExhibitionView getExhibitionById(Long exhibitionId) {
        return exhibitionRepository.findById(exhibitionId)
                .map(exhibition -> new ExhibitionView(
                        exhibition.getExhibitionId(),
                        exhibition.getName(),
                        exhibition.getDescription(),
                        exhibition.getPhotoUrl()
                ))
                .orElse(null);
    }

    public Exhibition checkIngress(ExhibitionIngressView exhibitionIngressView) {
        return exhibitionRepository.findByQrCode(exhibitionIngressView.getQrCode())
                .orElse(null);
    }

    public List<ArtifactPointLabel> locateArtifacts(Long exhibitionId, MultipartFile image) throws IOException {
        Exhibition exhibition = exhibitionRepository.findById(exhibitionId)
            .orElse(null);
    
        if (exhibition == null) {
            return null;
        }
    
        Map<Long, ArtifactInfoTemp> artifactInfoTemp = new HashMap<>();

        exhibition.getArtifacts().forEach(artifact -> {
            artifactInfoTemp.put(artifact.getArtefactId(), new ArtifactInfoTemp(
                artifact.getName(),
                new LLMUpload(artifact.getLlmPhotoUrl(), artifact.getLlmMimeType())
            ));
        });

        if (artifactInfoTemp.isEmpty()) {
            return null;
        }

        List<ArtifactPointLabel> artifactPointLabels = llmService.locateArtifacts(image, artifactInfoTemp);
        
        if (artifactPointLabels.isEmpty()) {
            return null;
        }

        System.out.println("Response body: " + artifactPointLabels);

        return artifactPointLabels;
    }

}
