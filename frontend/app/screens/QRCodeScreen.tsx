import React, { useEffect, useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const SCAN_TTL_MS = 5000;

export default function QRCodeScreen() {
  const router = useRouter();
  const { axiosInstance } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission) {
    return <SafeAreaView className="flex-1 bg-black" />;
  }
  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center p-4">
        <Text className="text-white mb-4 text-center">
          We need camera access to scan QR codes
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="px-6 py-3 bg-senary rounded-full"
        >
          <Text className="text-septenary font-inter font-medium">
            Grant Permission
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const onBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
  
    const exhibitionId = parseInt(data, 10);
    try {
      const resp = await axiosInstance.get(`/exhibitions/${exhibitionId}`);
      console.log('Exhibition found:', resp.data);
      console.log('Exhibition ID:', id);

      if (resp.data.exhibitionId !== id && id) {
        Alert.alert('Invalid QR', 'This QR code does not match the exhibition.');
      } else {
        router.replace(
          {
          pathname: './PhotoScreen',
          params: {
              image: resp.data.image,
              name: resp.data.name,
              description: resp.data.description,
              exhibitionId: resp.data.exhibitionId,
          },
        });
      }

      
    } catch (err: any) {
      if (err.response?.status === 404) {
        Alert.alert('Invalid QR', 'That exhibition was not found.');
      } else {
        Alert.alert('Network error', 'Could not verify this exhibition.');
      }
    }
  
    setTimeout(() => setScanned(false), SCAN_TTL_MS);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar hidden />
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={onBarCodeScanned}
      />


      <View className="absolute top-4 inset-x-4 flex-row justify-between items-center z-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-24 h-24 items-center justify-center"
        >
          <Ionicons name="close" size={32} color="#FFF" />
        </TouchableOpacity>
        <Image
          source={require('../../assets/images/imgs/logo.png')}
          className="w-48 h-24"
          resizeMode="contain"
        />
        <View className="w-16 h-16" />
      </View>

      <View className="absolute inset-0 flex items-center justify-center">
        <View className="w-[220px] h-[220px] relative">
          <View className="absolute top-0 left-0 w-[35px] h-[5px] bg-white rounded-sm" />
          <View className="absolute top-0 left-0 w-[5px] h-[35px] bg-white rounded-sm" />

          <View className="absolute top-0 right-0 w-[35px] h-[5px] bg-white rounded-sm rotate-180" />
          <View className="absolute top-0 right-0 w-[5px] h-[35px] bg-white rounded-sm rotate-180" />

          <View className="absolute bottom-0 right-0 w-[35px] h-[5px] bg-white rounded-sm rotate-180" />
          <View className="absolute bottom-0 right-0 w-[5px] h-[35px] bg-white rounded-sm rotate-180" />

          <View className="absolute bottom-0 left-0 w-[35px] h-[5px] bg-white rounded-sm rotate-270" />
          <View className="absolute bottom-0 left-0 w-[5px] h-[35px] bg-white rounded-sm rotate-270" />
        </View>
      </View>

      <View className="absolute inset-x-5 bottom-12 bg-white rounded-full flex-row items-center justify-center py-2 mx-8">
        <MaterialCommunityIcons
          name="qrcode-scan"
          size={20}
          color="#000"
          className="mr-2"
        />
        <Text className="text-black text-sm font-inter">
          Point the camera at a QR CODE
        </Text>
      </View>
    </SafeAreaView>
  );
}
