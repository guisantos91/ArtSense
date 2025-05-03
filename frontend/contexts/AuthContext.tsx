import React from 'react';
import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
  } from 'react';
import axios from 'axios';
import { router } from 'expo-router';
import { LoginCredentials, 
        SignupCredentials,
        logInAPI, 
        signUpAPI
} from '@/api';
import Constants from 'expo-constants';
  
interface AuthContextType {
  axiosInstance: any;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (signupcredentials: SignupCredentials) => Promise<void>;
}

const BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL; // The configuration of the base URL is in the app.json file

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
  });

  // login method
  const login = async (credentials: LoginCredentials) => {
    try {
      await logInAPI(axiosInstance, credentials);
    } catch (error) {
      console.log('Login error:', error);
      throw error;
    }
  };

  // signup method
  const signup = async (credentials: SignupCredentials) => {
    try {
        await signUpAPI(axiosInstance, credentials);
    } catch (error) {
        console.log('Signup error:', error);
        throw error;
    }
  };

  const value = {
    axiosInstance,
    login,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// custom hook to use auth context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };