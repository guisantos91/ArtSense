export type { 
    LoginCredentials, 
    SignupCredentials,
    ArtifactPointLabel
} from './dto/dto';

export {
    logInAPI,
    signUpAPI,
    getMuseumsAPI,
    getExhibitionsAPI,
    getExhibitionByMuseumAPI,
    locateArtifactsAPI,
    getArtifactAPI
} from './api-consumer';

export type {
    Museum,
    Exhibition,
    ExhibitionWithoutMuseum,
    Artifact
} from './api-consumer';
