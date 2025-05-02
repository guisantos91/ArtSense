import React, { useRef, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import LoadingOverlay from "../components/LoadingOverlay";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import ArtifactBottomSheet from "../components/ArtifactBottomSheet";

interface ArtifactPoint {
  x: number;
  y: number;
  artifactId: number;
  artifactName: string;
}

const PhotoScreen = () => {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [isLoading, setIsLoading] = useState(false);
  const [photoData, setPhotoData] = useState<{
    uri: string;
    width: number;
    height: number;
  } | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<ArtifactPoint | null>(
    null
  );
  const [sheetIndex, setSheetIndex] = useState(0);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["30%", "93%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    setSheetIndex(index);
  }, []);

  const openBottomSheet = (point: ArtifactPoint) => {
    setSelectedPoint(point);
    bottomSheetRef.current?.snapToIndex(0);
    setSheetIndex(0);
  };

  const points: ArtifactPoint[] = [
    { x: 12.0, y: 7.0, artifactId: 1, artifactName: "Mona Lisa" },
    { x: 20.0, y: 15.0, artifactId: 2, artifactName: "Starry Night" },
    { x: 30.0, y: 25.0, artifactId: 3, artifactName: "The Scream" },
    {
      x: 40.0,
      y: 35.0,
      artifactId: 4,
      artifactName: "The Persistence of Memory",
    },
    { x: 750.0, y: 3000.0, artifactId: 5, artifactName: "The Last Supper" },
  ];

  if (!permission) return <Text>Requesting for camera permission</Text>;

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-center mb-4 text-lg">
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if (ref.current) {
      setIsLoading(true);
      try {
        const photo = await ref.current.takePictureAsync();
        setPhotoData({
          uri: photo.uri,
          width: photo.width,
          height: photo.height,
        });
      } catch (error) {
        console.error("Error taking a picture: ", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const cancelPhoto = () => setPhotoData(null);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-primary">
        {photoData ? (
          <ImageBackground
            source={{ uri: photoData.uri }}
            className="flex-1 justify-between relative"
            resizeMode="cover"
          >
            {points.map((point, index) => {
              const scaledX = (point.x / 1000) * photoData.width;
              const scaledY = (point.y / 1000) * photoData.height;

              return (
                <TouchableOpacity
                  key={index}
                  className="absolute"
                  style={{ left: scaledX, top: scaledY }}
                  onPress={() => openBottomSheet(point)}
                >
                  <View className="relative w-5 h-5 items-center justify-center">
                    <View className="absolute w-10 h-10 bg-white opacity-20 rounded-full" />
                    <View className="w-5 h-5 bg-white rounded-full" />
                  </View>
                </TouchableOpacity>
              );
            })}

            <View className="items-center">
              <Image
                source={require("../../assets/images/imgs/logo_ArtSense.png")}
                className="self-center"
                style={{ width: 160, resizeMode: "contain" }}
              />
            </View>

            <View className="flex-row items-start w-full pl-6 pb-10">
              <TouchableOpacity
                className="bg-senary p-3 rounded-full"
                onPress={cancelPhoto}
              >
                <AntDesign name="arrowleft" size={32} color="black" />
              </TouchableOpacity>
            </View>

            <ArtifactBottomSheet
              bottomSheetRef={bottomSheetRef}
              snapPoints={snapPoints}
              selectedPoint={selectedPoint}
              sheetIndex={sheetIndex}
              setSheetIndex={setSheetIndex}
            />
          </ImageBackground>
        ) : (
          <View className="flex-1 relative">
            <CameraView style={{ flex: 1 }} ref={ref} facing={facing} />

            <View className="absolute inset-0">
              <View className="flex-row items-center justify-between px-[6%]">
                <View className="items-start w-14">
                  <TouchableOpacity
                    onPress={() => router.push("./MuseumScreen")}
                    className="bg-white p-2 rounded-full"
                    activeOpacity={0.8}
                  >
                    <AntDesign name="close" size={32} color="black" />
                  </TouchableOpacity>
                </View>

                <View className="flex-1 items-center self-center">
                  <Image
                    source={require("../../assets/images/imgs/logo_ArtSense.png")}
                    className="self-center"
                    style={{ width: 160, resizeMode: "contain" }}
                  />
                </View>

                <View className="w-14" />
              </View>

              <View className="flex-1 flex-col justify-end items-center mb-16 space-y-4">
                <View className="flex-row items-center space-x-2 p-3 bg-senary rounded-xl mb-5">
                  <Text className="text-black font-ebgaramond text-lg mr-2">
                    Point the camera to a section with artfacts
                  </Text>
                  <Entypo name="camera" size={24} color="black" />
                </View>

                <TouchableOpacity
                  onPress={takePicture}
                  className="w-24 h-24 rounded-full border-4 border-white items-center justify-center"
                >
                  <View className="w-20 h-20 bg-white rounded-full" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {isLoading && <LoadingOverlay />}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default PhotoScreen;
