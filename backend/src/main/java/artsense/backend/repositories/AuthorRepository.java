package artsense.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import artsense.backend.models.Author;

import java.util.Optional;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long>{
    Optional<Author> findByName(String name);
}
