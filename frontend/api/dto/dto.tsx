interface LoginCredentials {
    email: string;
    password: string;
}

interface SignupCredentials {
    name: string;
    email: string;
    password: string;
}

interface ArtifactPointLabel{
    artifactId: number;
    x: number;
    y: number;
    name: string;
}

export type { 
    LoginCredentials, 
    SignupCredentials,
    ArtifactPointLabel 
};