import React, { useState, useEffect } from 'react';
import {  
  Platform,
  SafeAreaView,
  StatusBar,
  View,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function QRCodeScanner() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <SafeAreaView className="flex-1 bg-black" />;
  }
  if (hasPermission === false) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <Text className="text-white">Camera access denied</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      {Platform.OS === 'android' && <StatusBar hidden />}

      <BarCodeScanner
        onBarCodeScanned={({ data }) => console.log(data)}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        style={{ flex: 1 }}
      />

      <View className="absolute top-4 inset-x-4 flex-row justify-between items-center z-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-12 h-12 bg-black/60 rounded-full items-center justify-center"
        >
          <Ionicons name="close" size={24} color="#FFF" />
        </TouchableOpacity>

        <Image
          source={require('../../assets/images/imgs/logo.png')}
          className="w-32 h-8"
          resizeMode="contain"
        />

        <View className="w-12 h-12" />
      </View>

      <View className="absolute inset-0 flex items-center justify-center">
        <View className="w-[250px] h-[250px] relative">
          <View className="absolute top-0 left-0 w-[30px] h-[4px] bg-white" />
          <View className="absolute top-0 left-0 w-[4px] h-[30px] bg-white" />
          <View className="absolute top-0 right-0 w-[30px] h-[4px] bg-white rotate-90" />
          <View className="absolute top-0 right-0 w-[4px] h-[30px] bg-white rotate-90" />
          <View className="absolute bottom-0 right-0 w-[30px] h-[4px] bg-white rotate-180" />
          <View className="absolute bottom-0 right-0 w-[4px] h-[30px] bg-white rotate-180" />
          <View className="absolute bottom-0 left-0 w-[30px] h-[4px] bg-white rotate-270" />
          <View className="absolute bottom-0 left-0 w-[4px] h-[30px] bg-white rotate-270" />
        </View>
      </View>

      <View className="absolute inset-x-5 bottom-10 bg-white rounded-full flex-row items-center justify-center py-3">
        <MaterialCommunityIcons
          name="qrcode-scan"
          size={20}
          color="#000"
          className="mr-2"
        />
        <Text className="text-black text-base font-inter">
          Point the camera at a QR CODE
        </Text>
      </View>
    </SafeAreaView>
  );
}

