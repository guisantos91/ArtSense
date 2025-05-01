package artsense.backend.dto;

public class ArtifactInfoTemp {
    private String name;
    private String photoUrl;
    private String mimeType;

    public ArtifactInfoTemp(String name, String photoUrl, String mimeType) {
        this.name = name;
        this.photoUrl = photoUrl;
        this.mimeType = mimeType;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
}
