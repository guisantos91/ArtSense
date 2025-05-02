import React from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
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
}

const ArtifactBottomSheet = ({
  bottomSheetRef,
  snapPoints,
  selectedPoint,
  sheetIndex,
  setSheetIndex,
}: Props) => {
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={(index) => requestAnimationFrame(() => setSheetIndex(index))}
      enablePanDownToClose={true}
      handleComponent={() => null}
      backgroundStyle={{ backgroundColor: "transparent", borderRadius: 0 }}
    >
      <BottomSheetView className="flex-1 overflow-hidden bg-primary rounded-t-[40]">
        <ImageBackground
          source={require("../../assets/images/imgs/exhibition.png")}
          resizeMode="cover"
          className="w-full h-[75%] pt-3 px-8"
        >
          <LinearGradient
            colors={["rgba(28, 28, 30, 0)", "rgba(28, 28, 30, 0.8)", "#101010"]}
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
