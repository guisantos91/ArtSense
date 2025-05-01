package artsense.backend.dto;

import java.time.LocalDateTime;

public class ExhibitionCardView {
    private Long exhibitionId;
    private String name;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String photoUrl;

    public ExhibitionCardView(Long exhibitionId, String name, LocalDateTime startDate, LocalDateTime endDate, String photoUrl) {
        this.exhibitionId = exhibitionId;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.photoUrl = photoUrl;
    }

    public Long getExhibitionId() {
        return exhibitionId;
    }

    public String getName() {
        return name;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
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
    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }
    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }
    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
}
