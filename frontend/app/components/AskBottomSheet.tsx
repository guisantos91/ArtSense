import React, { useState, useRef, useEffect, use } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  TextInput,
  Image,
  Animated,
  Easing,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import BottomSheet, { BottomSheetView, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Artifact, promptLLM } from "@/api";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  askSheetRef: React.RefObject<BottomSheet | null>;
  artifact?: Artifact;
  articactId?: number;
}

const AskBottomSheet = ({ askSheetRef, artifact, articactId }: Props) => {
  const snapPoints = ["93%"];
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>("aaaaa");
  const [tempPrompt, setTempPrompt] = useState<string>("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const { axiosInstance } = useAuth();
  const arrowAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (prompt === "") {
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
    } else {
      arrowAnimation.stopAnimation(); // Para a animação quando começa a escrever
    }
  }, [prompt]);

  const handleSend = async () => {
    if (!tempPrompt.trim()) return;
    if (!articactId) return;
    setPrompt(tempPrompt); // só agora atualiza o título com o input
    setIsLoading(true);
    setResponse(null);

    const formData = new FormData();
    formData.append('extraPhoto', '');

    const response = await promptLLM(axiosInstance, tempPrompt, articactId, formData);
    
    setIsLoading(false);
    setResponse(
      response.response
    );
    
    setTempPrompt("");
  };

  return (
    <BottomSheet
      ref={askSheetRef}
      index={-1}
      keyboardBlurBehavior="restore"
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      handleComponent={() => null}
      backgroundStyle={{ backgroundColor: "transparent", borderRadius: 0 }}
    >
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <BottomSheetView className="flex-1 overflow-hidden bg-primary rounded-t-[40]">
      {/* <ScrollView automaticallyAdjustKeyboardInsets={true}> */}
        <ImageBackground
          source={artifact?.photoUrl && typeof artifact.photoUrl === "string" ? { uri: artifact.photoUrl } : undefined}
          resizeMode="cover"
          className="w-full h-[50%] pt-3 px-8"
        >
          <LinearGradient
            colors={["rgba(28, 28, 30, 0)", "rgba(28, 28, 30, 0.95)", "#202020"]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
          <View className="items-center justify-center">
            <View className="w-10 h-1 rounded-full bg-white" />
          </View>
          <View className="absolute top-4 left-4 z-10">
            <TouchableOpacity
              onPress={() => askSheetRef.current?.close()}
              className="m-[10%]"
            >
              <AntDesign name="arrowleft" size={34} color="#D9D8DE" />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View className="flex-1 px-8 pt-4">
          {isLoading && (
            <View className="flex-row items-center -mt-36 rounded-xl">
              <ActivityIndicator size="small" color="#fff" />
              <Text className="text-white text-base font-inter font-semibold ml-4">
                Analysing....
              </Text>
            </View>
          )}

          {!isLoading && response && (
            <View className=" rounded-2xl -mt-36">
              <View className="flex-row justify-between mb-3">
                <Text className="text-white text-3xl font-semibold font-inter">
                  {prompt}
                </Text>
              </View>
              <Text className="text-white text-lg leading-5 mt-5">
                {response}
              </Text>
              <View className="flex-row mt-4 space-x-2">
                <View className="border border-[#D9D8DE] rounded-full px-4 py-1 mr-2">
                  <Text className="text-white text-xs">G 1974 incident</Text>
                </View>
                <View className="border border-[#D9D8DE] rounded-full px-4 py-1">
                  <Text className="text-white text-xs">
                    G history reflection
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {prompt === "" && (
          <View className="absolute bottom-20 w-full ml-[35%] z-10">
            <Animated.View
              style={{ transform: [{ translateY: arrowAnimation }] }}
            >
              <AntDesign name="arrowdown" size={24} color="white" />
            </Animated.View>
          </View>
        )}

        <View className="absolute bottom-5 left-0 right-0 px-8 flex-row items-end justify-between">
          <View className="flex-1 bg-[#202020] rounded-xl mr-3">
            <BottomSheetTextInput
              value={tempPrompt}
              onChangeText={setTempPrompt}
              placeholder="Ask a question..."
              placeholderTextColor="#CFCFCF"
              autoCapitalize="none"
              multiline
              className="bg-tertiary rounded-xl px-4 py-3 text-quaternary font-inter w-[92%] self-center"
              style={{ textAlignVertical: "center" }}
            />
          </View>
          <TouchableOpacity
            className="bg-tertiary rounded-2xl px-4 py-3"
            activeOpacity={0.8}
          >
            <FontAwesome5 name="images" size={18} color="#D9D8DE" />
          </TouchableOpacity>
          <TouchableOpacity
            className="px-2 py-2 ml-2"
            activeOpacity={0.8}
            onPress={handleSend}
          >
            <Ionicons name="paper-plane" size={24} color="#D9D8DE" />
          </TouchableOpacity>
        </View>
      {/* </ScrollView> */}
      </BottomSheetView>
      </TouchableWithoutFeedback>
    </BottomSheet>
  );
};

export default AskBottomSheet;
