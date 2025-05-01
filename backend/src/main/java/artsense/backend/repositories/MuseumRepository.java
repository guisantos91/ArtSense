package artsense.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import artsense.backend.models.Museum;

@Repository
public interface MuseumRepository extends JpaRepository<Museum, Long>{
    Optional<Museum> findByName(String name);;
}
