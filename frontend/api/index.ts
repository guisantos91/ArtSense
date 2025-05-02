export type { 
    LoginCredentials, 
    SignupCredentials
} from './dto/dto';

export {
    logInAPI,
    signUpAPI,
    getMuseumsAPI,
    getExhibitionsAPI,
    getExhibitionByMuseumAPI
} from './api-consumer';

export type {
    Museum,
    Exhibition,
    ExhibitionWithoutMuseum
} from './api-consumer';
