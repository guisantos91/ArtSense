package artsense.backend.dto;

public class MuseumCardView {
    private Long museumId;
    private String photoUrl;
    private String name;
    private String location;
    private String description;

    public MuseumCardView(Long museumId, String photoUrl, String name, String location, String description) {
        this.museumId = museumId;
        this.photoUrl = photoUrl;
        this.name = name;
        this.location = location;
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getMuseumId() {
        return museumId;
    }

    public void setMuseumId(Long museumId) {
        this.museumId = museumId;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
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
}
