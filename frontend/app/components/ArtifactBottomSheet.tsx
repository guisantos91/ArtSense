import React from "react";
import { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  Animated,
  Easing,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";

interface ArtifactPoint {
  x: number;
  y: number;
  artifactId: number;
  artifactName: string;
}

interface Props {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  snapPoints: string[];
  selectedPoint: ArtifactPoint | null;
  sheetIndex: number;
  setSheetIndex: (index: number) => void;
  askSheetRef: React.RefObject<BottomSheet | null>;
}

const ArtifactBottomSheet = ({
  bottomSheetRef,
  snapPoints,
  selectedPoint,
  sheetIndex,
  setSheetIndex,
  askSheetRef,
}: Props) => {
  const arrowAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(arrowAnimation, {
          toValue: -10,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
        Animated.timing(arrowAnimation, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
      ])
    ).start();
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={(index) => {
        const safeIndex = Math.min(Math.max(index, 0), 1);
        requestAnimationFrame(() => setSheetIndex(safeIndex));
      }}
      enablePanDownToClose={true}
      handleComponent={() => null}
      backgroundStyle={{ backgroundColor: "transparent", borderRadius: 0 }}
    >
      <BottomSheetView className="flex-1 overflow-hidden bg-primary rounded-t-[40]">
        <ImageBackground
          source={require("../../assets/images/imgs/exhibition.png")}
          resizeMode="cover"
          className="w-full h-[50%] pt-3 px-8"
        >
          <LinearGradient
            colors={["rgba(28, 28, 30, 0)", "rgba(28, 28, 30, 0.8)", "#202020"]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />

          <View className="items-center justify-center">
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: "white",
              }}
            />
          </View>

          {sheetIndex === 1 && (
            <>
              <View className="absolute top-4 left-4 z-10">
                <TouchableOpacity
                  onPress={() => {
                    bottomSheetRef.current?.close();
                    setSheetIndex(0);
                  }}
                  className="m-[10%]"
                >
                  <AntDesign name="arrowleft" size={34} color="#D9D8DE" />
                </TouchableOpacity>
              </View>

              <View className="absolute mt-[55%] flex-1 w-full self-center">
                <Text className="text-white text-5xl text-[40px] font-ebgaramond leading-none">
                  Der Wanderer über dem Nebelmeer
                </Text>
                <Text className="text-white text-base font-inter mt-1">
                  1818, Germany
                </Text>

                <View className="flex-row justify-between">
                  <View className="space-y-4 w-[50%] mt-6">
                    <View>
                      <Text className="text-white font-bold text-xl mt-4">
                        Dimensions
                      </Text>
                      <Text className="text-white text-base">148 × 178 cm</Text>
                    </View>
                    <View>
                      <Text className="text-white font-bold text-xl mt-4">
                        Material
                      </Text>
                      <Text className="text-white text-base">
                        Oil on Canvas
                      </Text>
                    </View>
                    <View>
                      <Text className="text-white font-bold text-xl mt-4">
                        Year
                      </Text>
                      <Text className="text-white text-base">1818</Text>
                    </View>
                  </View>

                  <View className="w-[40%] items-start space-y-2">
                    <Image
                      source={require("../../assets/images/imgs/exhibition.png")}
                      className="w-full h-40 rounded-md mb-2 self-end"
                    />
                    <Text className="text-white font-ebgaramond font-semibold text-lg">
                      Caspar David Friedrich
                    </Text>
                    <Text className="text-white text-xs leading-snug mt-4">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer
                    </Text>
                  </View>
                </View>
                <View className="items-center flex-1">
                  <Animated.View
                    style={{ transform: [{ translateY: arrowAnimation }] }}
                  >
                    <AntDesign name="arrowdown" size={24} color="white" />
                  </Animated.View>

                  <TouchableOpacity
                    onPress={() => {
                      askSheetRef.current?.snapToIndex(0);
                    }}
                  >
                    <View className="bg-senary rounded-2xl px-4 py-3 mt-2 self-center">
                      <Text className="text-center text-primary">
                        Ask what you want to know
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          {selectedPoint && sheetIndex === 0 && (
            <View className="flex-1 items-center justify-start space-y-4">
              <Text className="text-white text-4xl font-ebgaramond text-center mt-[25%]">
                {selectedPoint.artifactName}
              </Text>

              <TouchableOpacity
                className="bg-white px-4 py-2 rounded-xl shadow mt-2"
                onPress={() => {
                  bottomSheetRef.current?.snapToIndex(1);
                  setSheetIndex(1);
                }}
              >
                <Text className="text-primary text-lg">See Details</Text>
              </TouchableOpacity>
            </View>
          )}
        </ImageBackground>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default ArtifactBottomSheet;
