import * as Font from 'expo-font';

export async function useFonts (){
  await Font.loadAsync({
    'JBMono': require('../assets/fonts/JetBrainsMono-Regular.ttf'),
    'JBMono-Bold': require('../assets/fonts/JetBrainsMono-Bold.ttf'),
    'JBMono-SemiBold': require('../assets/fonts/JetBrainsMono-SemiBold.ttf'),
    // indie: require('../assets/fonts/Ubuntu-BoldItalic.ttf'),
  });
}