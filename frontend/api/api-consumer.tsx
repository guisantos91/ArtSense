import { AxiosInstance } from 'axios';
import { LoginCredentials, SignupCredentials } from './dto/dto';

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

export {
    logInAPI,
    signUpAPI
}