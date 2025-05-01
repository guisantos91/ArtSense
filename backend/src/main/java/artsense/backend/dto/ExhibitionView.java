package artsense.backend.dto;

public class ExhibitionView {
    private Long exhibitionId;
    private String name;
    private String description;
    private String photoUrl;

    public ExhibitionView(Long exhibitionId, String name, String description, String photoUrl) {
        this.exhibitionId = exhibitionId;
        this.name = name;
        this.description = description;
        this.photoUrl = photoUrl;
    }

    public Long getExhibitionId() {
        return exhibitionId;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setExhibitionId(Long exhibitionId) {
        this.exhibitionId = exhibitionId;
    }

    public void setName(String name) {
        this.name = name;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
}
