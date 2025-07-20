import 'dotenv/config';
import fs from 'fs';
import path from 'path';

const googleServicesJson = process.env.GOOGLE_SERVICES_JSON;

export default ({ config }) => {
  console.log('✅ Managed workflow: EAS will inject google-services.json automatically');

  return {
    ...config,
    expo: {
      ...config.expo,
      name: "my-expo-app",
      slug: "my-expo-app",
      version: "1.0.0",
      web: {
        favicon: "./assets/favicon.png"
      },
      experiments: {
        tsconfigPaths: true
      },
      plugins: [
        "expo-notifications",
        '@react-native-firebase/app'
      ],
      orientation: "portrait",
      icon: "./assets/icon.png",
      userInterfaceStyle: "light",
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      },
      assetBundlePatterns: [
        "**/*"
      ],
      ios: {
        supportsTablet: true
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#ffffff",
          softwareKeyboardLayoutMode: "resize"
        },
        package: "com.sars12312.myexpoapp",
        googleServicesFile: './google-services.json'
      },
      extra: {
        eas: {
          projectId: "3b65a0e0-1ade-4e17-86df-13ef60ea6ea2"
        }
      }
    }
  };
};
