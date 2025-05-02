import { AxiosInstance } from 'axios';
import { LoginCredentials, SignupCredentials } from './dto/dto';
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

export {
    logInAPI,
    signUpAPI,
    getMuseumsAPI,
    getExhibitionsAPI,
    getExhibitionByMuseumAPI
}

export type { Museum, Exhibition, ExhibitionWithoutMuseum };