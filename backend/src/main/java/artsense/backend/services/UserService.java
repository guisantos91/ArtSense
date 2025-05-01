package artsense.backend.services;

import org.springframework.stereotype.Service;

import artsense.backend.dto.CreateUserView;
import artsense.backend.dto.UserView;
import artsense.backend.models.User;
import artsense.backend.repositories.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(CreateUserView createUserView) {
        User user = new User();

        if (userRepository.findByEmail(createUserView.getEmail()) != null) {
            throw new IllegalArgumentException("User with this email already exists");
        }

        user.setEmail(createUserView.getEmail());
        user.setPassword(createUserView.getPassword());
        user.setName(createUserView.getName());
        return userRepository.save(user);
    }

    public boolean validateUser(UserView userView) {
        User user = userRepository.findByEmail(userView.getEmail());
        if (user == null) {
            return false;
        }
        return user.getPassword().equals(userView.getPassword());
    }
}
