package artsense.backend.services;

import java.util.List;

import org.springframework.stereotype.Service;

import artsense.backend.dto.MuseumCardView;
import artsense.backend.dto.MuseumView;
import artsense.backend.models.Museum;
import artsense.backend.repositories.MuseumRepository;

@Service
public class MuseumService {
    private final MuseumRepository museumRepository;

    public MuseumService(MuseumRepository museumRepository) {
        this.museumRepository = museumRepository;
    }

    public List<MuseumCardView> getAllMuseums() {
        List<Museum> museums = museumRepository.findAll();
        return museums.stream()
                .map(museum -> new MuseumCardView(museum.getMuseumId(), museum.getPhotoUrl(), museum.getName(), museum.getLocation()))
                .toList();
    }

    public MuseumView getMuseumById(Long museumId) {
        return museumRepository.findById(museumId)
                .map(museum -> new MuseumView(museum.getMuseumId(), museum.getPhotoUrl(), museum.getName(), museum.getLocation()))
                .orElse(null);
    }

}
