package artsense.backend.dto;

public class ExhibitionIngressView {
    private String qrCode;

    public ExhibitionIngressView(String qrCode) {
        this.qrCode = qrCode;
    }

    public String getQrCode() {
        return qrCode;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }
}
