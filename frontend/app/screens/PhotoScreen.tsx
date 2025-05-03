import React, {
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
  ImageBackground,
  LayoutChangeEvent,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import LoadingOverlay from "../components/LoadingOverlay";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import ArtifactBottomSheet from "../components/ArtifactBottomSheet";
import { ArtifactPointLabel, locateArtifactsAPI } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import * as ImageManipulator from "expo-image-manipulator";
import AskBottomSheet from "../components/AskBottomSheet";
import { AxiosError } from "axios";
import Logo from "../components/Logo";


const PhotoScreen = () => {
  const { axiosInstance } = useAuth();
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
  const [selectedPoint, setSelectedPoint] = useState<ArtifactPointLabel | null>(
    null
  );
  const [sheetIndex, setSheetIndex] = useState(0);
  const [points, setPoints] = useState<ArtifactPointLabel[]>([]);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["30%", "93%"], []);

  const askSheetRef = useRef<BottomSheet>(null);

  const handleSheetChanges = useCallback((index: number) => {
    setSheetIndex(index);
  }, []);

  const { image, name, description, exhibitionId } = useLocalSearchParams<{
    image: string;
    name: string;
    description: string;
    exhibitionId: string;
  }>();

  const openBottomSheet = (point: ArtifactPointLabel) => {
    setSelectedPoint(point);
    bottomSheetRef.current?.snapToIndex(0);
    setSheetIndex(0);
  };

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
      setPoints([]); 
      try {
        const photo = await ref.current.takePictureAsync({ quality: 0.1 });

        setPhotoData({
          uri: photo.uri,
          width: photo.width,
          height: photo.height,
        });

        const formData = new FormData();
        const uriParts = photo.uri.split("/");
        const fileName = uriParts[uriParts.length - 1];
        let fileType = fileName.split(".").pop();
        if (fileType === "jpg") fileType = "jpeg";

        formData.append("image", {
          uri: photo.uri,
          name: fileName,
          type: `image/${fileType}`,
        } as any);

        const response = await locateArtifactsAPI(
          axiosInstance,
          parseInt(exhibitionId),
          formData
        );
        const backendPoints: ArtifactPointLabel[] = response.data;

        if (backendPoints && backendPoints.length > 0) {
          console.log("Points detected by the API: ", backendPoints);

          setPoints(backendPoints);
          openBottomSheet(backendPoints[0]); // Open the bottom sheet for the first detected point
          setPhotoData({
            uri: photo.uri,
            width: photo.width,
            height: photo.height,
          });
        } else {
          console.log("No artifacts detected by the API.");
          Alert.alert("No Artifacts Found", "Could not detect any known artifacts in the photo.");
          setPhotoData(null);
        }

      } catch (error: any) {
        console.error("Error taking a picture: ", error);
        if (error.isAxiosError) {
          const axiosError = error as AxiosError; // Type assertion
          if (axiosError.response?.status === 404) {
            console.log("API returned 404: No artifacts found.");
            Alert.alert("No Artifacts Found", "Could not detect any known artifacts in the photo.");
          }
        } else {
          // Handle non-Axios errors (e.g., camera issues, processing errors)
          Alert.alert("Error", "An error occurred while processing the photo.");
        }
      } finally {
        setIsLoading(false);
      }
    };
  }

  const cancelPhoto = () => {
    setPhotoData(null);
    setPoints([]);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-primary">
        {photoData ? (
          <ImageBackground
            source={{ uri: photoData.uri }}
            className="flex-1 justify-between relative"
            resizeMode="cover"
          >
            {photoData && points.map((point, index) => {
              const photoWidth = photoData.width;
              const photoHeight = photoData.height;

                const displayWidth = Dimensions.get("window").width;
                const displayHeight = Dimensions.get("window").height;
                console.log("Display dimensions: ", {
                  displayWidth,
                  displayHeight,
                });
                console.log("Image dimensions: ", { photoWidth, photoHeight });

                const finalX = (point.x / 1000) * displayWidth;
                const finalY = (point.y / 1000) * displayHeight;

              return (
                <TouchableOpacity
                  key={index}
                  className="absolute"
                  style={{ left: finalX, top: finalY }}
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
              <Logo />
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
              askSheetRef={askSheetRef}
            />

            <AskBottomSheet askSheetRef={askSheetRef} />
          </ImageBackground>
        ) : (
          <View className="flex-1 relative">
            <CameraView style={{ flex: 1 }} ref={ref} facing={facing} />

            <View className="absolute inset-0">
              <View className="flex-row items-center justify-between px-[6%]">
                <View className="items-start w-14">
                  <TouchableOpacity
                    onPress={() => router.back()}
                    className="bg-white p-2 rounded-full"
                    activeOpacity={0.8}
                  >
                    <AntDesign name="close" size={32} color="black" />
                  </TouchableOpacity>
                </View>

                <View className="flex-1 items-center self-center">
                  <Logo />
                </View>

                <View className="w-14" />
              </View>

              <View className="flex-1 flex-col justify-end items-center mb-16 space-y-4">
                <View className="flex-row items-center space-x-2 p-3 bg-senary rounded-xl mb-5">
                  <Text className="text-black font-inter text-sm mr-4">
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
