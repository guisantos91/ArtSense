package artsense.backend;

import artsense.backend.models.*;
import artsense.backend.repositories.*;
import artsense.backend.services.LLMService;
import artsense.backend.dto.LLMUpload;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MuseumRepository museumRepository;
    private final AuthorRepository authorRepository; // Corrected typo from AuthorReprository
    private final ArtifactRepository artifactRepository;
    private final ExhibitionRepository exhibitionRepository;
    private final LLMService llmService;

    public DataLoader(UserRepository userRepository,
                      MuseumRepository museumRepository,
                      AuthorRepository authorRepository, // Corrected typo
                      ArtifactRepository artifactRepository,
                      ExhibitionRepository exhibitionRepository,
                      LLMService llmService) {
        this.userRepository = userRepository;
        this.museumRepository = museumRepository;
        this.authorRepository = authorRepository;
        this.artifactRepository = artifactRepository;
        this.exhibitionRepository = exhibitionRepository;
        this.llmService = llmService;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("DataLoader is running...");

        // --- Create User ---
        User testUser = null;
        if (userRepository.findByEmail("test@example.com") == null) {
            testUser = new User("Test User", "test@example.com", "123");
            userRepository.save(testUser);
            System.out.println("Created test user.");
        } else {
            testUser = userRepository.findByEmail("test@example.com");
            System.out.println("Test user already exists.");
        }

        // --- Create Museum ---
        Museum louvre = null;
        if (museumRepository.findByName("Louvre Museum").isEmpty()) {
            louvre = new Museum("Louvre Museum", "Paris, France", "The world's largest art museum.", "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi1.wp.com%2Fawesomesasquatch.com%2Fwp-content%2Fuploads%2F2019%2F05%2FLOUVRE_5921.jpg&f=1&nofb=1&ipt=59c8fb6cdb4101663e05c8977fbba5dfbb6b5f7bcdff848cccf81ae2cd4dc9cd");
            museumRepository.save(louvre);
            System.out.println("Created Louvre Museum.");
        } else {
            louvre = museumRepository.findByName("Louvre Museum").get(); // Assuming name is unique
             System.out.println("Louvre Museum already exists.");
        }

        // --- Create Author ---
        Author daVinci = null;
        if (authorRepository.findByName("Leonardo da Vinci").isEmpty()) {
            daVinci = new Author("Leonardo da Vinci", "Italian polymath of the High Renaissance.", "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fres.cloudinary.com%2Fdk-find-out%2Fimage%2Fupload%2Fq_80%2Cw_1920%2Cf_auto%2FA-Getty-148277064_oysal9.jpg&f=1&nofb=1&ipt=e687604c11142b107c7da046a88aeec66dc29657a9539a9ff92deeb991e97f17");
            authorRepository.save(daVinci);
            System.out.println("Created Leonardo da Vinci author.");
        } else {
             daVinci = authorRepository.findByName("Leonardo da Vinci").get(); // Assuming name is unique
             System.out.println("Leonardo da Vinci author already exists.");
        }

        // --- Create Artifact ---
        Artifact monaLisa = null;
        if (artifactRepository.findByName("Mona Lisa").isEmpty()) {
            String photoUrl = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pariscityvision.com%2Flibrary%2Fimage%2F5449.jpg&f=1&nofb=1&ipt=1218a5f666566c4dbfdd75535848cacbaf3386dc208b26a1ceb1238640627355";
            LLMUpload llmupload = this.llmService.uploadFile("987", photoUrl, "image/jpeg");
            monaLisa = new Artifact("Mona Lisa", 1503, "Louvre Museum", "Portrait of Lisa Gherardini.", "Oil on poplar panel",photoUrl, "77 cm × 53 cm", daVinci, llmupload.getLlmPhotoUrl(), llmupload.getLlmMimeType());
            artifactRepository.save(monaLisa);
            System.out.println("Created Mona Lisa artifact.");
        } else {
            monaLisa = artifactRepository.findByName("Mona Lisa").get(); // Assuming name is unique
            System.out.println("Mona Lisa artifact already exists.");
        }

        Artifact starryNight = null;
        if (artifactRepository.findByName("Starry Night").isEmpty()) {
            String photoUrl = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpaperaccess.com%2Ffull%2F2997.jpg&f=1&nofb=1&ipt=b8189d63acc69fe645e36e1c82d232840251c6cf68797130ceb063842dd7e120";
            LLMUpload llmupload = this.llmService.uploadFile("2222", photoUrl, "image/jpeg");
            starryNight = new Artifact("Starry Night", 1889, "Museum of Modern Art", "A swirling night sky over a quiet town.", "Oil on canvas", photoUrl, "73.7 cm × 92.1 cm", daVinci, llmupload.getLlmPhotoUrl(), llmupload.getLlmMimeType());
            artifactRepository.save(starryNight);
            System.out.println("Created Starry Night artifact.");
        } else {
            starryNight = artifactRepository.findByName("Starry Night").get(); // Assuming name is unique
            System.out.println("Starry Night artifact already exists.");
        }

        // --- Create Exhibition ---
        Exhibition renaissanceExhibition = null;
        if (exhibitionRepository.findByName("Renaissance Masterpieces").isEmpty()) {
            renaissanceExhibition = new Exhibition(
                    "Renaissance Masterpieces",
                    "A collection of famous Renaissance art.",
                    "QR12345", // Example QR code
                    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fnoma.org%2Fwp-content%2Fuploads%2F2018%2F02%2FDSC1711_2000.jpg&f=1&nofb=1&ipt=94d64d3537d6e69395836771fffe262c8642bed2ccfc877b8a09febc959f8915",
                    LocalDateTime.now().minusDays(30),
                    LocalDateTime.now().plusDays(60),
                    louvre,
                    List.of(monaLisa, starryNight) 
            );
            exhibitionRepository.save(renaissanceExhibition);
            System.out.println("Created Renaissance Masterpieces exhibition.");
        } else {
            renaissanceExhibition = exhibitionRepository.findByName("Renaissance Masterpieces").get(); // Assuming name is unique
            System.out.println("Renaissance Masterpieces exhibition already exists.");
        }

        System.out.println("DataLoader finished.");
    }
}