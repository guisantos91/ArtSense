package artsense.backend;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import artsense.backend.dto.LLMUpload;
import artsense.backend.models.Artifact; // Import Transactional
import artsense.backend.models.Author;
import artsense.backend.models.Exhibition;
import artsense.backend.models.Museum;
import artsense.backend.models.User;
import artsense.backend.repositories.ArtifactRepository;
import artsense.backend.repositories.AuthorRepository;
import artsense.backend.repositories.ExhibitionRepository;
import artsense.backend.repositories.MuseumRepository;
import artsense.backend.repositories.UserRepository;
import artsense.backend.services.LLMService;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MuseumRepository museumRepository;
    private final AuthorRepository authorRepository;
    private final ArtifactRepository artifactRepository;
    private final ExhibitionRepository exhibitionRepository;
    private final LLMService llmService;

    public DataLoader(UserRepository userRepository,
                      MuseumRepository museumRepository,
                      AuthorRepository authorRepository,
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
    @Transactional // Add Transactional to ensure all operations are part of a single transaction
    public void run(String... args) throws Exception {
        System.out.println("DataLoader is running...");

        // --- Create User ---
        User testUser = findOrCreateUser("Test User", "test@example.com", "password123");

        // --- Create Museums ---
        Museum louvre = findOrCreateMuseum(
            "Louvre Museum",
            "Paris, France",
            "The world's largest art museum and a historic monument in Paris. Located on the Right Bank of the Seine, it's a central landmark known for housing masterpieces like the Mona Lisa.", // Shortened (198 chars)
            "https://cdn.craft.cloud/101e4579-0e19-46b6-95c6-7eb27e4afc41/assets/uploads/pois/louvre-102840_640.webp"
        );

        Museum orsay = findOrCreateMuseum(
            "Musée d'Orsay",
            "Paris, France",
            "Housed in a former railway station, this museum holds mainly French art dating from 1848 to 1914, including paintings, sculptures, furniture, and photography. Famous for its Impressionist collection.", // Shortened
            "https://media.istockphoto.com/id/481556246/photo/dorsay-museum-in-paris-france.jpg?s=612x612&w=0&k=20&c=P7FqGtOUGR2B5YqE6kLTPz7-wzJrKysMit23VGWWZI0=" 
        );


        // --- Create Authors ---
        Author daVinci = findOrCreateAuthor(
            "Leonardo da Vinci",
            "Italian High Renaissance polymath, famed painter, sculptor, architect, musician, scientist, inventor, anatomist, geologist, cartographer, botanist, writer, and historian. Known for Mona Lisa and The Last Supper.", // Shortened
            "https://i.pinimg.com/564x/ea/99/17/ea9917931bd716bc9616c61555eaa190.jpg"
        );

        Author vanGogh = findOrCreateAuthor(
            "Vincent van Gogh",
            "Dutch Post-Impressionist painter, one of the most famous figures in Western art history. Created ~2,100 artworks in a decade, including Starry Night and Sunflowers. Known for emotional intensity and bold colors.", // Shortened
            "https://hips.hearstapps.com/hmg-prod/images/vincent_van_gogh_self_portrait_painting_muse%CC%81e_d'orsay_via_wikimedia_commons_promo.jpg?resize=980:*" // Placeholder URL
        );

        Author monet = findOrCreateAuthor( // Added Monet for Orsay
            "Claude Monet",
            "Founder of French Impressionist painting, known for expressing one's perceptions before nature, especially applied to plein air landscape painting. Famous for his Water Lilies series.", // Shortened
            "https://uploads0.wikiart.org/00115/images/claude-monet/440px-claude-monet-1899-nadar-crop.jpg!Portrait.jpg" 
        );


        // --- Create Artifacts ---
        Artifact monaLisa = findOrCreateArtifact(
            "Mona Lisa", 1503, "Louvre Museum",
            "Iconic half-length portrait by Leonardo da Vinci. An archetypal Italian Renaissance masterpiece, perhaps the most famous painting globally. Known for its enigmatic smile and sfumato technique.", // Shortened
            "Oil on poplar panel",
            "https://en.wikipedia.org/wiki/File:Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg",
            "77 cm × 53 cm", daVinci, "artifact_monalisa"
        );

        Artifact starryNight = findOrCreateArtifact(
            "The Starry Night", 1889, "Museum of Modern Art",
            "Van Gogh's depiction of the view from his asylum window at Saint-Rémy-de-Provence before sunrise, with an idealized village. A key work of Post-Impressionism, held at MoMA since 1941.", // Shortened
            "Oil on canvas",
            "https://www.researchgate.net/publication/2604197/figure/fig7/AS:668765079498761@1536457428251/Starry-Night-Vincent-van-Gogh-1889-1-Low-level-visual-features-blue-dark-yellow.ppm",
            "73.7 cm × 92.1 cm", vanGogh, "artifact_starrynight" // Corrected Author
        );

         Artifact selfPortraitVanGogh = findOrCreateArtifact(
            "Self-Portrait with Bandaged Ear", 1889, "Courtauld Gallery (Previously)", // Note: Location varies
            "Famous self-portrait by Van Gogh, painted after mutilating his left ear. Shows the artist in his studio wearing a blue cap and green overcoat, reflecting a turbulent period.", // Shortened
            "Oil on canvas",
            "https://ka-perseus-images.s3.amazonaws.com/653f09fedc305ad96ff0f7272df19fa7624f3c7e.jpg", // Placeholder URL
            "60 cm x 49 cm", vanGogh, "artifact_vangogh_self"
        );

        Artifact waterLilies = findOrCreateArtifact(
            "Water Lilies (Nymphéas)", 1916, "Musée d'Orsay", // Associated with Orsay (Note: Many versions exist, associating one here)
            "Part of Monet's famous series depicting his flower garden at Giverny. These large-scale works capture the changing light and atmosphere on the surface of his lily pond.", // Shortened
            "Oil on canvas",
            "https://m.media-amazon.com/images/I/71k6C5JV9vL._AC_UF894,1000_QL80_.jpg",
            "Varies (often large scale)", monet, "artifact_waterlilies"
        );

        Artifact wingedVictory = findOrCreateArtifact(
            "Winged Victory of Samothrace", 190, "Louvre Museum", // Associated with Louvre
            "A marble Hellenistic sculpture of Nike (the Greek goddess of victory), created around the 2nd century BC. Highly celebrated for its realistic portrayal of movement and drapery.", // Shortened
            "Parian marble",
            "https://www.worldhistory.org/img/r/p/500x600/5287.jpg?v=1652876104", 
            "244 cm (height)", null, "artifact_wingedvictory" // Author unknown/not applicable
        );


        // --- Create Exhibitions ---
        // Louvre Exhibitions
        Exhibition renaissanceExhibition = findOrCreateExhibition(
            "Renaissance Masterpieces",
            "Explore the genius of the Renaissance. This exhibition brings together iconic works from masters like Leonardo da Vinci, showcasing the artistic and intellectual explosion of the era.",
            "QR_RENAISSANCE_LOUVRE",
            "https://www.france-voyage.com/visuals/photos/louvre-museum-36217_w400.webp", 
            LocalDateTime.now().minusDays(30), LocalDateTime.now().plusDays(60),
            louvre, List.of(monaLisa) // Associated with Louvre
        );

        Exhibition greekAntiquityExhibition = findOrCreateExhibition(
            "Hellenistic Wonders",
            "Discover the dynamism and realism of Hellenistic Greek sculpture. Featuring masterpieces like the Winged Victory of Samothrace, witness the peak of ancient Greek artistry.",
            "QR_GREEK_LOUVRE",
            "https://i.redd.it/9svl51woqweb1.jpg", 
            LocalDateTime.now().minusDays(10), LocalDateTime.now().plusDays(80),
            louvre, List.of(wingedVictory) // Associated with Louvre
        );

        // Musée d'Orsay Exhibitions
        Exhibition postImpressionismExhibition = findOrCreateExhibition(
            "Visions of Post-Impressionism",
            "Journey through the vibrant colors and emotional depth of Post-Impressionism. Featuring seminal works by Vincent van Gogh, highlighting the move beyond Impressionism's limits.", // Shortened
            "QR_POSTIMPRESS_ORSAY", // Updated QR code
            "https://static01.nyt.com/images/2011/10/15/arts/15iht-orsay15-inline1/15iht-orsay15-inline1-articleLarge.jpg?quality=75&auto=webp&disable=upscale", 
            LocalDateTime.now().minusDays(15), LocalDateTime.now().plusDays(75),
            orsay, List.of(starryNight, selfPortraitVanGogh) // Associated with Orsay
        );

        Exhibition impressionistGardensExhibition = findOrCreateExhibition(
            "Impressionist Gardens: Monet",
            "Step into the vibrant world of Claude Monet's garden at Giverny. This exhibition focuses on his iconic Water Lilies series and other plein air masterpieces capturing light and nature.",
            "QR_IMPRESS_ORSAY",
            "https://www.travelcaffeine.com/wp-content/uploads/2018/09/musee-marmottan-monet-museum-paris-france-507.jpg", 
            LocalDateTime.now().minusDays(25), LocalDateTime.now().plusDays(55),
            orsay, List.of(waterLilies) // Associated with Orsay
        );

        System.out.println("DataLoader finished.");
    }

    // --- Helper Methods for Find or Create ---

    private User findOrCreateUser(String name, String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            user = new User(name, email, password); // Consider hashing the password here
            userRepository.save(user);
            System.out.println("Created user: " + email);
        } else {
            System.out.println("User already exists: " + email);
        }
        return user;
    }

    private Museum findOrCreateMuseum(String name, String location, String description, String photoUrl) {
        return museumRepository.findByName(name).orElseGet(() -> {
            Museum museum = new Museum(name, location, description, photoUrl);
            museumRepository.save(museum);
            System.out.println("Created museum: " + name);
            return museum;
        });
    }

     private Author findOrCreateAuthor(String name, String biography, String photoUrl) {
        return authorRepository.findByName(name).orElseGet(() -> {
            Author author = new Author(name, biography, photoUrl);
            authorRepository.save(author);
            System.out.println("Created author: " + name);
            return author;
        });
    }

    private Artifact findOrCreateArtifact(String name, int year, String museumLocation, String description, String medium, String photoUrl, String dimensions, Author author, String llmIdPrefix) {
         return artifactRepository.findByName(name).orElseGet(() -> {
            // Simulate LLM upload - replace "artifact_id_placeholder" with a real ID generation if needed
            String uniqueLlmId = llmIdPrefix + "_" + System.currentTimeMillis(); // Simple unique ID
            LLMUpload llmupload;
            try {
                llmupload = this.llmService.uploadFile(uniqueLlmId, photoUrl, "image/jpeg"); // Use unique ID
            } catch (Exception e) {
                System.err.println("Failed to upload LLM file for artifact: " + name + ": " + e.getMessage());
                llmupload = new LLMUpload("", ""); // Fallback values
            }

            Artifact artifact = new Artifact(name, year, museumLocation, description, medium, photoUrl, dimensions, author, llmupload.getLlmPhotoUrl(), llmupload.getLlmMimeType());
            artifactRepository.save(artifact);
            System.out.println("Created artifact: " + name);
            return artifact;
        });
    }

     private Exhibition findOrCreateExhibition(String name, String description, String qrCode, String photoUrl, LocalDateTime startDate, LocalDateTime endDate, Museum museum, List<Artifact> artifacts) {
        return exhibitionRepository.findByName(name).orElseGet(() -> {
            Exhibition exhibition = new Exhibition(name, description, qrCode, photoUrl, startDate, endDate, museum, artifacts);
            exhibitionRepository.save(exhibition);
            System.out.println("Created exhibition: " + name);
            return exhibition;
        });
    }
}