import axios, { AxiosInstance } from 'axios';
import { ArtifactPointLabel, LoginCredentials, SignupCredentials } from './dto/dto';
import { ImageSourcePropType } from 'react-native';

const logInAPI = async (
    axiosInstance: AxiosInstance,
    logincredentials: LoginCredentials
  ) => {
    const response = await axiosInstance.post<string>(
        '/sign-in',
        JSON.stringify(logincredentials),
        {
            headers: {
            'Content-Type': 'application/json',
            },
        }
    );
    return response;
};

const signUpAPI = async (
    axiosInstance: AxiosInstance,
    signupcredentials: SignupCredentials
  ) => {
    const response = await axiosInstance.post<string>(
        '/sign-up',
        JSON.stringify(signupcredentials),
        {
            headers: {
            'Content-Type': 'application/json',
            },
        }
    );
    return response;
}

const getMuseumsAPI = async (
    axiosInstance: AxiosInstance,
    museumStartsWith?: string
  ) => {
    const response = await axiosInstance.get<Museum[]>(
        `/museums${museumStartsWith ? `?museumStartsWith=${museumStartsWith}` : ''}`,
        {
            headers: {
            'Content-Type': 'application/json',
            },
        }
    );
    console.log("response: ", response);
    return response.data;
}

const getExhibitionsAPI = async (
    axiosInstance: AxiosInstance,
    museumStartsWith?: string
  ) => {
    const response = await axiosInstance.get<Exhibition[]>(
        `/exhibitions${museumStartsWith ? `?museumStartsWith=${museumStartsWith}` : ''}`,
        {
            headers: {
            'Content-Type': 'application/json',
            },
        }
    );
    return response.data;
}

const getArtifactAPI = async (
    axiosInstance: AxiosInstance,
    artifactId: number
) => {
    const response = await axiosInstance.get<Artifact>(
        `/artifacts/${artifactId}`,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
    return response.data;
}

const getExhibitionByMuseumAPI = async (
    axiosInstance: AxiosInstance,
    museumId: number,
    exhibitionStartsWith?: string
    ) => {
    const response = await axiosInstance.get<ExhibitionWithoutMuseum[]>(
        `/museums/${museumId}/exhibitions${
            exhibitionStartsWith ? `?exhibitionStartsWith=${exhibitionStartsWith}` : ''
        }`,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
    return response.data;
}

const locateArtifactsAPI = async (
    axiosInstance: AxiosInstance,
    exhibitionId: number,
    formData: FormData
) => {
    const response = await axiosInstance.post<ArtifactPointLabel[]>(
        `/exhibitions/${exhibitionId}/locate-artifacts`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response;
}

const promptLLM = async (
    axiosInstance: AxiosInstance,
    prompt: string,
    artifactId: number,
    extraPhoto: FormData
) => {
    console.log("prompt: " + prompt);
    const response = await axiosInstance.post<LLMResponse>(
        `/artifacts/${artifactId}/prompt?prompt=${encodeURIComponent(prompt)}`,
        extraPhoto,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data;
}

interface LLMResponse {
    response: string;
    htmlGoogleSearchSuggestion: string;
}

interface Museum {
    museumId: number;
    name: string;
    location: string;
    photoUrl: ImageSourcePropType;
    description: string;
}

interface Exhibition {
    museumName: string;
    exhibitionId: number;
    name: string;
    startDate: string;
    endDate: string;
    description: string;
    photoUrl: ImageSourcePropType;
}

interface ExhibitionWithoutMuseum {
    exhibitionId: number;
    name: string;
    startDate: string;
    endDate: string;
    description: string;
    photoUrl: ImageSourcePropType;
}

interface Author {
    authorId: number;
    name: string;
    description: string;
    photoUrl: ImageSourcePropType;
}

interface Artifact {
    name: string;
    year: number;
    location: string;
    description: string;
    material: string;
    photoUrl: ImageSourcePropType;
    dimensions: string;
    llmPhotoUrl: string;
    llmMimeType: string;
    author: Author;
}

export {
    logInAPI,
    signUpAPI,
    getMuseumsAPI,
    getExhibitionsAPI,
    getExhibitionByMuseumAPI,
    locateArtifactsAPI,
    getArtifactAPI,
    promptLLM
}

export type { Museum, Exhibition, ExhibitionWithoutMuseum, Artifact };