import React, { useState, useRef, useEffect, use, useMemo } from "react";
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
  StyleSheet,
  Dimensions,
  Linking,
} from "react-native";
import BottomSheet, {
  BottomSheetView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Artifact, promptLLM } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import { WebView, WebViewNavigation } from "react-native-webview";

interface Props {
  askSheetRef: React.RefObject<BottomSheet | null>;
  toOpen: boolean;
  setToOpen: (toOpen: boolean) => void;
  artifact?: Artifact;
  articactId?: number;
}

const AskBottomSheet = ({
  askSheetRef,
  toOpen,
  setToOpen,
  artifact,
  articactId,
}: Props) => {
  const snapPoints = ["93%"];
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [htmlGoogleSearchSuggestion, setHtmlGoogleSearchSuggestion] = useState<
    string | null
  >(null);
  const [tempPrompt, setTempPrompt] = useState<string>("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const { axiosInstance } = useAuth();
  const arrowAnimation = useRef(new Animated.Value(0)).current;

  const fullHtml = useMemo(
    () => `
  <!DOCTYPE html>
  <html data-theme="dark">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="dark">
      <style>
        html, body {
          background: transparent !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .container {
          display: flex !important;
          align-items: center !important;
          background-color: #202020 !important;
          padding: 8px 12px !important;
        }
        .container .headline {
          display: flex !important;
          align-items: center !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .container .headline > *:not(svg) {
          display: none !important;
        }
        .carousel {
          align-items: center !important;
          overflow-x: auto !important;
          white-space: nowrap !important;
          margin-left: 8px !important;
        }
        .chip {
          display: inline-flex !important;
          align-items: center !important;
          border-radius: 16px !important;
          padding: 4px 12px !important;
          margin-right: 8px !important;
          background-color: #2c2c2c !important;
          color: #fff !important;
          font-size: 13px !important;
          line-height: 16px !important;
        }
      </style>
    </head>
    <body>
      ${htmlGoogleSearchSuggestion}
    </body>
  </html>
`,
    [htmlGoogleSearchSuggestion]
  );

  const predefinedPrompts = [
    "Explain the background and significance of this artifact.",
    "Describe the materials and techniques used to create this piece.",
    "What historical context surrounds this artwork?",
    "Analyze the symbolism in this artifact.",
    "How did this object influence its era?",
    "Compare this artifact to others from the same period.",
    "What are the most notable details in this work?",
    "Summarize the story behind this piece.",
  ];

  useEffect(() => {
    const handleEffect = async () => {
      if (!toOpen) return;
      if (!articactId) return;
      setIsLoading(true);
      console.log("toOpen: ", toOpen);
      const randomPrompt =
        predefinedPrompts[Math.floor(Math.random() * predefinedPrompts.length)];
      console.log("randomPrompt: ", randomPrompt);
      setTempPrompt(randomPrompt);
      setToOpen(false);
    };

    handleEffect();
    handleSend();
  }, [toOpen]);

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
      arrowAnimation.stopAnimation();
    }
  }, [prompt]);

  const handleSend = async () => {
    if (!tempPrompt.trim()) return;
    if (!articactId) return;
    setPrompt(tempPrompt);
    setIsLoading(true);
    setResponse(null);
    setHtmlGoogleSearchSuggestion(null);

    const formData = new FormData();
    formData.append("extraPhoto", "");

    const response = await promptLLM(
      axiosInstance,
      tempPrompt,
      articactId,
      formData
    );

    setIsLoading(false);
    setResponse(response.response);
    setHtmlGoogleSearchSuggestion(response.htmlGoogleSearchSuggestion);
    console.log("Html: ", response.htmlGoogleSearchSuggestion);

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

          <ImageBackground
            source={
              artifact?.photoUrl && typeof artifact.photoUrl === "string"
                ? { uri: artifact.photoUrl }
                : undefined
            }
            resizeMode="cover"
            className="w-full h-[50%] pt-3 px-8"
          >
            <LinearGradient
              colors={[
                "rgba(28, 28, 30, 0)",
                "rgba(28, 28, 30, 0.95)",
                "#202020",
              ]}
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
              </View>
            )}
            {!isLoading && htmlGoogleSearchSuggestion && (
              <View style={{ width: "100%", height: 200, marginTop: 16 }}>
                <WebView
                  originWhitelist={["*"]}
                  source={{ html: fullHtml }}
                  style={styles.webview}
                  javaScriptEnabled
                  domStorageEnabled
                  automaticallyAdjustContentInsets={false}
                  onShouldStartLoadWithRequest={(event: WebViewNavigation) => {
                    const url = event.url;
                    if (
                      url.startsWith("data:text/html") ||
                      url === "about:blank"
                    ) {
                      return true;
                    }
                    Linking.openURL(url);
                    return false;
                  }}
                />
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
            <View className="flex-1 bg-[#202020] rounded-xlz">
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
              className="px-2 py-2 ml-2"
              activeOpacity={0.8}
              onPress={handleSend}
            >
              <Ionicons name="paper-plane" size={24} color="#D9D8DE" />
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </TouchableWithoutFeedback>
    </BottomSheet>
  );
};

export default AskBottomSheet;

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: 10,
  },
});
