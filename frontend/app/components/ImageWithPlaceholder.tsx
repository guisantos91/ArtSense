import React, { useState, useEffect } from 'react';
import {
  Image,
  View,
  ActivityIndicator,
  ImageSourcePropType,
} from 'react-native';
import { router } from 'expo-router';
import { AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';

interface ImageWithPlaceholderProps {
  image: ImageSourcePropType | string;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'repeat' | 'center';
  className?: string;
}

const getPhoto = async (
  photo_url: string,
  setImageUrl: (url: string) => void
) => {
  const axiosInstance: AxiosInstance = axios.create();
  console.log('Fetching photo with ID:', photo_url);
  interface GetPhotoResponse {
    data: Blob;
  }

  interface GetPhotoError {
    response?: {
      status?: number;
    };
  }

  if (photo_url.startsWith("http")) {
    setImageUrl(photo_url);
    return Promise.resolve();
  }

  axiosInstance
    .get<GetPhotoResponse>(photo_url, {
      responseType: 'blob',
    })
    .then((response: AxiosResponse<GetPhotoResponse>) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Str = Buffer.from(reader.result as ArrayBuffer).toString(
          'base64'
        );
        const dataUrl = `data:image/png;base64,${base64Str}`;
        setImageUrl(dataUrl);
      };
      reader.readAsArrayBuffer(response.data as unknown as Blob);
    })
    .catch((error: GetPhotoError) => {
      console.error('Error fetching photo:', error);
      throw error;
    });
};

const ImageWithPlaceholder: React.FC<ImageWithPlaceholderProps> = ({
  image,
  resizeMode = 'cover',
  className = '',
}) => {
  const [remoteUri, setRemoteUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (typeof image === 'string') {
      setLoading(true);
      getPhoto(
        image as string,
        (data: string): void => {
          if (!isMounted) return;
          setRemoteUri(
        data.startsWith('http') ? data : `data:image/png;base64,${data}`
          );
        }
      )
        .catch((err: { response?: { status?: number } }): void => {
          if (err.response?.status === 401) {
        router.replace('../screens/LoginScreen');
          } else {
        console.error('Error fetching photo:', err);
          }
        })
        .finally((): void => {
          if (isMounted) setLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [image]);

  if (typeof image !== 'string') {
    return (
      <Image
        source={image}
        className={className}
        resizeMode={resizeMode}
      />
    );
  }

  if (loading) {
    return (
      <View className={`bg-gray-200 ${className}`}>
        <ActivityIndicator size="small" color="#999" />
      </View>
    );
  }

  return remoteUri ? (
    <Image
      source={{ uri: remoteUri }}
      className={className}
      resizeMode={resizeMode}
    />
  ) : (
    <View className={`bg-gray-200 ${className}`} />
  );
};

export default ImageWithPlaceholder;
