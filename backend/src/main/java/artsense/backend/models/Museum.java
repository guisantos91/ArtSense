package artsense.backend.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "museums")
public class Museum {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long museumId;
    private String name;
    private String location;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    private String photoUrl;

    public Museum(String name, String location, String description, String photoUrl) {
        this.name = name;
        this.location = location;
        this.description = description;
        this.photoUrl = photoUrl;
    }
    public Museum() {
    }
    public Long getMuseumId() {
        return museumId;
    }
    public void setMuseumId(Long museumId) {
        this.museumId = museumId;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
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
    public String getPhotoUrl() {
        return photoUrl;
    }
    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
    @Override
    public String toString() {
        return "Museum{" +
                "museumId=" + museumId +
                ", name='" + name + '\'' +
                ", location='" + location + '\'' +
                ", description='" + description + '\'' +
                ", photoUrl='" + photoUrl + '\'' +
                '}';
    }
}
