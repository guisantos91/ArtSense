import React, { useEffect, useState } from 'react';
import {
  Image,
  View,
  ActivityIndicator,
  ImageSourcePropType,
} from 'react-native';
import { router } from 'expo-router';
import axios, { AxiosInstance } from 'axios';

interface ImageWithPlaceholderProps {
  image: ImageSourcePropType | string;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'repeat' | 'center';
  className?: string; // e.g. "rounded-2xl"
}

const fetchImage = async (url: string): Promise<string> => {
  // If it's already a public URL, just return it:
  if (url.startsWith('http')) return url;

  // Otherwise fetch blob → base64
  const instance: AxiosInstance = axios.create();
  const resp = await instance.get<ArrayBuffer>(url, {
    responseType: 'arraybuffer',
  });
  const b64 = Buffer.from(resp.data).toString('base64');
  return `data:image/png;base64,${b64}`;
};

const ImageWithPlaceholder: React.FC<ImageWithPlaceholderProps> = ({
  image,
  resizeMode = 'cover',
  className = '',
}) => {
  const [uri, setUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (typeof image === 'string') {
      setLoading(true);
      fetchImage(image)
        .then((u) => {
          if (mounted) setUri(u);
        })
        .catch((err: any) => {
          if (err.response?.status === 401) {
            router.replace('../screens/LoginScreen');
          } else {
            console.error(err);
          }
        })
        .finally(() => {
          if (mounted) setLoading(false);
        });
    }
    return () => {
      mounted = false;
    };
  }, [image]);

  // 1) Local asset: render immediately
  if (typeof image !== 'string') {
    return (
      <Image
        source={image}
        className={`w-full h-full ${className}`}
        resizeMode={resizeMode}
      />
    );
  }

  // 2) Loading state: gray box + spinner, full size
  if (loading) {
    return (
      <View
        className={`w-full h-full bg-gray-200 ${className} justify-center items-center`}
      >
        <ActivityIndicator size="small" color="#999" />
      </View>
    );
  }

  // 3) Loaded URL: render
  if (uri) {
    return (
      <Image
        source={{ uri }}
        className={`w-full h-full ${className}`}
        resizeMode={resizeMode}
      />
    );
  }

  // 4) Fallback: gray box full size
  return <View className={`w-full h-full bg-gray-200 ${className}`} />;
};

export default ImageWithPlaceholder;
