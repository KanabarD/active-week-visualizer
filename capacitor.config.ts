
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.270d9050391440039372edd8137ef888',
  appName: 'active-week-visualizer',
  webDir: 'dist',
  server: {
    url: 'https://270d9050-3914-4003-9372-edd8137ef888.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 1000,
      backgroundColor: "#ffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP"
    },
    Keyboard: {
      resize: "ionic",
      style: "dark",
      resizeOnFullScreen: true
    },
    StatusBar: {
      style: "light",
      backgroundColor: "#65a30d"
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false
  }
};

export default config;
