import { Text, View } from "react-native";
import { useFonts } from "expo-font";

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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="font-cormorant">Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
