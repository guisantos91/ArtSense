package artsense.backend.dto;

public class MuseumView {
    private Long museumId;
    private String name;
    private String description;
    private String location;

    public MuseumView(Long museumId, String name, String description, String location) {
        this.museumId = museumId;
        this.name = name;
        this.description = description;
        this.location = location;
    }

    public Long getMuseumId() {
        return museumId;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getLocation() {
        return location;
    }
}
