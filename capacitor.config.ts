import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.palallama.alertapersona',
  appName: 'AlertaPersona',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    hostname: 'app-alertapersona.julitorossian.dev'
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav"
    },
    Geolocation: {
      androidBackgroundLocationRationale: {
        title: "Permitir ubicación en segundo plano",
        message: "Esta app necesita tu ubicación aunque no la estés usando.",
        buttonPositive: "Aceptar",
        buttonNegative: "Cancelar"
      },
      androidBackgroundLocationPrompt: {
        title: "Ubicación en segundo plano",
        message: "¿Querés permitir que esta app acceda a tu ubicación en segundo plano?",
        buttonPositive: "Aceptar",
        buttonNegative: "Cancelar"
      }
    }
  }
};

export default config;
