package artsense.backend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "artifacts")
public class Artifact {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long artefactId;
    private String name;
    private int year;
    private String location;
    private String description;
    private String material;
    private String photoUrl;
    private String dimensions;
    private String llmPhotoUrl;
    private String llmMimeType;

    @ManyToOne
    @JoinColumn(name = "authorId")
    private Author author;
    
    public Artifact(String name, int year, String location, String description, String material, String photoUrl, String dimensions,
            Author author, String llmPhotoUrl, String llmMimeType) {
        this.name = name;
        this.year = year;
        this.location = location;
        this.description = description;
        this.material = material;
        this.photoUrl = photoUrl;
        this.dimensions = dimensions;
        this.author = author;
        this.llmPhotoUrl = llmPhotoUrl;
        this.llmMimeType = llmMimeType;
    }

    public Artifact() {
    }
    public Long getArtefactId() {
        return artefactId;
    }
    public void setArtefactId(Long artefactId) {
        this.artefactId = artefactId;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public int getYear() {
        return year;
    }
    public void setYear(int year) {
        this.year = year;
    }
    public String getLocation() {
        return location;
    }
    public void setLocation(String location) {
        this.location = location;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getMaterial() {
        return material;
    }
    public void setMaterial(String material) {
        this.material = material;
    }
    public String getPhotoUrl() {
        return photoUrl;
    }
    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
    public String getDimensions() {
        return dimensions;
    }
    public void setDimensions(String dimensions) {
        this.dimensions = dimensions;
    }
    public Author getAuthor() {
        return author;
    }
    public void setAuthor(Author author) {
        this.author = author;
    }
    public String getLlmPhotoUrl() {
        return llmPhotoUrl;
    }

    public void setLlmPhotoUrl(String llmPhotoUrl) {
        this.llmPhotoUrl = llmPhotoUrl;
    }

    public String getLlmMimeType() {
        return llmMimeType;
    }

    public void setLlmMimeType(String llmMimeType) {
        this.llmMimeType = llmMimeType;
    }
    @Override
    public String toString() {
        return "Artifact{" +
                "artefactId=" + artefactId +
                ", name='" + name + '\'' +
                ", year=" + year +
                ", location='" + location + '\'' +
                ", description='" + description + '\'' +
                ", material='" + material + '\'' +
                ", photoUrl='" + photoUrl + '\'' +
                ", dimensions='" + dimensions + '\'' +
                ", author=" + author +
                ", llmPhotoUrl='" + llmPhotoUrl + '\'' +
                ", llmMimeType='" + llmMimeType + '\'' +
                '}';
    }

}
