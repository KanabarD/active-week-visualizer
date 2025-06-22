
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.270d9050391440039372edd8137ef888',
  appName: 'active-week-visualizer',
  webDir: 'dist',
  server: {
    url: 'https://270d9050-3914-4003-9372-edd8137ef888.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;
