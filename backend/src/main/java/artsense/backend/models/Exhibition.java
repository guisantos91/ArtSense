package artsense.backend.models;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "exhibitions")
public class Exhibition {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long exhibitionId;
    private String name;
    private String description;
    private String qrCode;
    private String photoUrl;
    private LocalDateTime startDate;    
    private LocalDateTime endDate;

    @ManyToOne
    @JoinColumn(name = "museumId")
    private Museum museum;

    @ManyToMany
    @JoinTable(name = "exhibition_artifact",
            joinColumns = @JoinColumn(name = "exhibitionId"),
            inverseJoinColumns = @JoinColumn(name = "artifactId"))
    private List<Artifact> artifacts;

    public Exhibition(String name, String description, String qrCode, String photoUrl, LocalDateTime startDate,
            LocalDateTime endDate, Museum museum, List<Artifact> artifacts) {
        this.name = name;
        this.description = description;
        this.qrCode = qrCode;
        this.photoUrl = photoUrl;
        this.startDate = startDate;
        this.endDate = endDate;
        this.museum = museum;
        this.artifacts = artifacts;
    }

    public Exhibition() {
    }
    public Long getExhibitionId() {
        return exhibitionId;
    }
    public void setExhibitionId(Long exhibitionId) {
        this.exhibitionId = exhibitionId;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getQrCode() {
        return qrCode;
    }
    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }
    public String getPhotoUrl() {
        return photoUrl;
    }
    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
    public LocalDateTime getStartDate() {
        return startDate;
    }
    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }
    public LocalDateTime getEndDate() {
        return endDate;
    } 
    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }
    public Museum getMuseum() {
        return museum;
    }
    public void setMuseum(Museum museum) {
        this.museum = museum;
    }
    public List<Artifact> getArtifacts() {
        return artifacts;
    }
    public void setArtifacts(List<Artifact> artifacts) {
        this.artifacts = artifacts;
    }
    @Override
    public String toString() {
        return "Exhibition{" +
                "exhibitionId=" + exhibitionId +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", qrCode='" + qrCode + '\'' +
                ", photoUrl='" + photoUrl + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", museum=" + museum +
                ", artifacts=" + artifacts +
                '}';
    }
}
