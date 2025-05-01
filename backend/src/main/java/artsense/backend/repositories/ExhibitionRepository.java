package artsense.backend.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import artsense.backend.dto.ExhibitionCardView;
import artsense.backend.dto.ExhibitionCardWithMuseum;
import artsense.backend.models.Exhibition;

@Repository
public interface ExhibitionRepository extends JpaRepository<Exhibition, Long>{
    List<ExhibitionCardView> findByMuseum_MuseumIdAndStartDateLessThanEqualAndEndDateGreaterThanEqualOrderByStartDateAsc(Long museumId, LocalDateTime currentDateForStartComparison, LocalDateTime currentDateForEndComparison);
    List<ExhibitionCardWithMuseum> findByMuseum_MuseumId(Long museumId);
    Optional<Exhibition> findByQrCode(String qrCode);
    Optional<Exhibition> findByName(String name);
}
