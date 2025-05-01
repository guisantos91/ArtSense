import { useFonts } from "expo-font";
import { StatusBar } from "react-native";
import StartScreen from "./screens/StartScreen";

export default function Index() {
  const [fontsLoaded] = useFonts({
    CormorantGaramond: require("../assets/fonts/CormorantGaramond-VariableFont_wght.ttf"),
    "CormorantGaramond-Italic": require("../assets/fonts/CormorantGaramond-Italic-VariableFont_wght.ttf"),
    EBGaramond: require("../assets/fonts/EBGaramond-VariableFont_wght.ttf"),
    "EBGaramond-Italic": require("../assets/fonts/EBGaramond-Italic-VariableFont_wght.ttf"),
    Inter: require("../assets/fonts/Inter-VariableFont_opsz,wght.ttf"),
    "Inter-Italic": require("../assets/fonts/Inter-Italic-VariableFont_opsz,wght.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <StartScreen />
    </>
  );
}
