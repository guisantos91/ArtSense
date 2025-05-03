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
            "The Louvre Museum, located in Paris, France, is the world's largest art museum and a historic monument. Situated on the Right Bank of the Seine in the 1st arrondissement, it is a central landmark of the city. Its vast collection spans from ancient civilizations to the mid-19th century, featuring iconic works like the Mona Lisa and the Venus de Milo.",
            "https://cdn.craft.cloud/101e4579-0e19-46b6-95c6-7eb27e4afc41/assets/uploads/pois/louvre-102840_640.webp"
        );

        Museum orsay = findOrCreateMuseum(
            "Musée d'Orsay",
            "Paris, France",
            "Housed in the stunning former Gare d'Orsay railway station built for the 1900 Exposition Universelle, the Musée d'Orsay boasts an extensive collection of French art from 1848 to 1914. It bridges the gap between the Louvre's older collections and the modern art at the Centre Pompidou, and is particularly renowned for holding the largest collection of Impressionist and Post-Impressionist masterpieces in the world.",
            "https://media.istockphoto.com/id/481556246/photo/dorsay-museum-in-paris-france.jpg?s=612x612&w=0&k=20&c=P7FqGtOUGR2B5YqE6kLTPz7-wzJrKysMit23VGWWZI0="
        );


        // --- Create Authors ---
        Author daVinci = findOrCreateAuthor(
            "Leonardo da Vinci",
            "An Italian polymath of the High Renaissance, Leonardo da Vinci (1452-1519) is renowned for his contributions to art, science, and engineering.",
            "https://i.pinimg.com/564x/ea/99/17/ea9917931bd716bc9616c61555eaa190.jpg"
        );

        Author vanGogh = findOrCreateAuthor(
            "Vincent van Gogh",
            "Vincent Willem van Gogh (1853-1890) was a Dutch Post-Impressionist painter who became one of the most influential figures in Western art history.",
            "https://hips.hearstapps.com/hmg-prod/images/vincent_van_gogh_self_portrait_painting_muse%CC%81e_d'orsay_via_wikimedia_commons_promo.jpg?resize=980:*" // Placeholder URL
        );

        Author monet = findOrCreateAuthor(
            "Claude Monet",
            "Oscar-Claude Monet (1840-1926) was a French painter and a founder of the Impressionist movement, which is seen as a key precursor to modernism.",
            "https://uploads0.wikiart.org/00115/images/claude-monet/440px-claude-monet-1899-nadar-crop.jpg!Portrait.jpg"
        );


        // --- Create Artifacts ---
        Artifact monaLisa = findOrCreateArtifact(
            "Mona Lisa", 1503, "Louvre Museum",
            "This half-length portrait by Leonardo da Vinci is arguably the most famous painting in the world. Considered an archetypal masterpiece of the Italian Renaissance, it's renowned for the sitter's enigmatic expression, the subtle modeling of forms (sfumato), and the atmospheric illusionism of the landscape background. Its fame is unparalleled, making it a global icon.",
            "Oil on poplar panel",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/500px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
            "77 cm x 53 cm", daVinci, "artifact_monalisa",
            "image/jpg"
        );

        Artifact starryNight = findOrCreateArtifact( // Note: Actual location is MoMA, using Orsay for demo
            "The Starry Night", 1889, "Musée d'Orsay",
            "Painted during his stay at the asylum in Saint-Rémy-de-Provence, this oil-on-canvas by Vincent van Gogh depicts the view from his east-facing window just before sunrise, with the addition of an idealized village. It is celebrated for its intense emotional expression, swirling brushstrokes, and symbolic representation of the night sky, becoming one of the most recognized paintings in Western art.",
            "Oil on canvas",
            "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.jC8qrBAxwffzUVacVkrffgAAAA%26pid%3DApi&f=1&ipt=f2d975145a10ee897f42f30447c22c01ab5dee5152b4c35201712a465a68322e",
            "73.7 cm x 92.1 cm", vanGogh, "artifact_starrynight",
            "image/jpg"
        );

         Artifact selfPortraitVanGogh = findOrCreateArtifact( // Note: Actual location is Courtauld, using Orsay for demo
            "Self-Portrait with Bandaged Ear", 1889, "Musée d'Orsay",
            "One of several self-portraits Van Gogh painted after mutilating his left ear during a psychotic episode. This poignant work shows the artist in his studio, wearing a blue cap and green overcoat, with a bandaged ear. It offers a raw glimpse into his mental state and resilience during a turbulent period of his life.",
            "Oil on canvas",
            "https://ka-perseus-images.s3.amazonaws.com/653f09fedc305ad96ff0f7272df19fa7624f3c7e.jpg",
            "60 cm x 49 cm", vanGogh, "artifact_vangogh_self",
            "image/jpg"
        );

        Artifact waterLilies = findOrCreateArtifact(
            "Water Lilies (Nymphéas)", 1916, "Musée d'Orsay",
            "This painting is part of Claude Monet's extensive series depicting his beloved flower garden at his home in Giverny. Created later in his life, these works, often monumental in scale, are immersive studies of light, reflection, and atmosphere on the surface of his lily pond. They represent a culmination of his Impressionist exploration of nature and perception.",
            "Oil on canvas",
            "https://m.media-amazon.com/images/I/71k6C5JV9vL._AC_UF894,1000_QL80_.jpg",
            "Varies (often large scale)", monet, "artifact_waterlilies",
            "image/jpg"
        );

        Artifact wingedVictory = findOrCreateArtifact(
            "Winged Victory of Samothrace", 190, "Louvre Museum",
            "Also known as the Nike of Samothrace, this 2nd-century BC marble sculpture depicts the Greek goddess of victory, Nike. Despite being significantly damaged (most notably missing her head and arms), it is celebrated as one of the greatest surviving masterpieces of Hellenistic sculpture. Its dynamic pose, masterful rendering of flowing drapery, and dramatic sense of movement are highly admired.",
            "Parian marble",
            "https://www.worldhistory.org/img/r/p/500x600/5287.jpg?v=1652876104",
            "244 cm (height)", monet, "artifact_wingedvictory", // Author unknown/not applicable
            "image/jpg" // Placeholder for LLM ID
        );

        // --- Create Exhibitions ---
        // Louvre Exhibitions
        Exhibition renaissanceExhibition = findOrCreateExhibition(
            "Renaissance Masterpieces: Leonardo and Beyond",
            "Delve into the heart of the Italian Renaissance, a period of extraordinary artistic and intellectual flourishing. This exhibition centers on the genius of Leonardo da Vinci, featuring the iconic Mona Lisa, alongside works by other masters that showcase the era's innovation in technique, perspective, and humanism.",
            "QR_RENAISSANCE_LOUVRE",
            "https://www.france-voyage.com/visuals/photos/louvre-museum-36217_w400.webp",
            LocalDateTime.now().minusDays(30), LocalDateTime.now().plusDays(60),
            louvre, List.of(monaLisa) // Associated with Louvre
        );

        Exhibition greekAntiquityExhibition = findOrCreateExhibition(
            "Hellenistic Wonders: Movement and Majesty",
            "Experience the dramatic power and sophisticated realism of Hellenistic Greek sculpture (323–31 BC). Featuring celebrated works like the Winged Victory of Samothrace, this exhibition explores how artists of this era captured intense emotion, dynamic movement, and intricate detail, pushing the boundaries of classical forms.",
            "QR_GREEK_LOUVRE",
            "https://i.redd.it/9svl51woqweb1.jpg",
            LocalDateTime.now().minusDays(10), LocalDateTime.now().plusDays(80),
            louvre, List.of(wingedVictory) // Associated with Louvre
        );

        // Musée d'Orsay Exhibitions
        Exhibition postImpressionismExhibition = findOrCreateExhibition(
            "Van Gogh: Visions of Post-Impressionism",
            "Journey through the vibrant colors, expressive brushwork, and profound emotional depth that define Post-Impressionism. This exhibition focuses on seminal works by Vincent van Gogh, including The Starry Night and his self-portraits, illustrating his unique artistic vision and his pivotal role in the transition towards modern art.",
            "QR_POSTIMPRESS_ORSAY", // Updated QR code
            "https://static01.nyt.com/images/2011/10/15/arts/15iht-orsay15-inline1/15iht-orsay15-inline1-articleLarge.jpg?quality=75&auto=webp&disable=upscale",
            LocalDateTime.now().minusDays(15), LocalDateTime.now().plusDays(75),
            orsay, List.of(starryNight, selfPortraitVanGogh) // Associated with Orsay
        );

        Exhibition impressionistGardensExhibition = findOrCreateExhibition(
            "Monet's Garden: Reflections of Impressionism",
            "Immerse yourself in the serene and captivating world of Claude Monet's garden at Giverny. This exhibition highlights his iconic Water Lilies series and other plein air masterpieces, showcasing his lifelong dedication to capturing the fleeting effects of light, color, and atmosphere in nature, defining the Impressionist movement.",
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

    private Artifact findOrCreateArtifact(String name, int year, String museumLocation, String description, String medium, String photoUrl, String dimensions, Author author, String llmIdPrefix, String contentType) {
        return artifactRepository.findByName(name).orElseGet(() -> {
            // Simulate LLM upload - replace "artifact_id_placeholder" with a real ID generation if needed
            String uniqueLlmId = llmIdPrefix + "_" + System.currentTimeMillis(); // Simple unique ID
            LLMUpload llmupload;
            try {
                llmupload = this.llmService.uploadFile(uniqueLlmId, photoUrl, contentType); // Use unique ID
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