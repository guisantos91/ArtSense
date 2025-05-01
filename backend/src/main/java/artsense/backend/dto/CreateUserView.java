package artsense.backend.dto;

public class CreateUserView extends UserView {
    private String name;

    public CreateUserView(String name, String email, String password) {
        super(email, password);
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
