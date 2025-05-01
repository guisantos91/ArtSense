package artsense.backend.dto;

public class ArtifactPointLabel {
    private Double x;
    private Double y;
    private Long artifactId;
    private String name;

    public ArtifactPointLabel(Double x, Double y, Long artifactId, String name) {
        this.x = x;
        this.y = y;
        this.artifactId = artifactId;
        this.name = name;
    }

    public Double getX() {
        return x;
    }

    public void setX(Double x) {
        this.x = x;
    }

    public Double getY() {
        return y;
    }

    public void setY(Double y) {
        this.y = y;
    }

    public Long getArtifactId() {
        return artifactId;
    }

    public void setArtifactId(Long artifactId) {
        this.artifactId = artifactId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
