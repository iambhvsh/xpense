import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.xpense.app',
  appName: 'xpense',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
