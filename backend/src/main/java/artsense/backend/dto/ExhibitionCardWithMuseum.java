package artsense.backend.dto;

import java.time.LocalDateTime;

public class ExhibitionCardWithMuseum extends ExhibitionCardView {
    String museumName;

    public ExhibitionCardWithMuseum(String museumName, Long exhibitionId, String name, LocalDateTime startDate, LocalDateTime endDate, String photoUrl) {
        super(exhibitionId, name, startDate, endDate, photoUrl);
        this.museumName = museumName;
    }

    public String getMuseumName() {
        return museumName;
    }

    public void setMuseumName(String museumName) {
        this.museumName = museumName;
    }
}

