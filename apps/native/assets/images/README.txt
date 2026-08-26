NeuroTrace — store and app assets
Mark: concept 03 "focus ring". Primary violet #6D42E8, deep violet #9333EA, ink #15121D.

GOOGLE PLAY
  screenshot-1.png … screenshot-6.png   1080 x 1920 (9:16 phone screenshots)
    1 one question at a time · 2 scored properly · 3 doctor's report
    4 daily check-in · 5 six-month trend · 6 privacy
  feature-graphic.png                   1024 x 500  (no transparency)
  play-store-icon.png                   512 x 512   (32-bit PNG)

EXPO (place in ./assets/)
  icon.png                              1024 x 1024  opaque, iOS light + universal
  icon-dark.png                         1024 x 1024  ios.icon.dark
  icon-tinted.png                       1024 x 1024  ios.icon.tinted (greyscale)
  adaptive-icon.png                     1024 x 1024  transparent foreground, art inside the 66% safe circle
  adaptive-icon-monochrome.png          1024 x 1024  Android 13+ themed icons, flat silhouette on alpha
  notification-icon.png                 96 x 96      white on transparent
  splash-icon.png                       1024 x 1024  transparent, expo-splash-screen imageWidth 220
  favicon.png                           48 x 48      Expo web

app.json
{
  "expo": {
    "name": "NeuroTrace",
    "slug": "neurotrace",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "ios": { "icon": { "light": "./assets/icon.png", "dark": "./assets/icon-dark.png", "tinted": "./assets/icon-tinted.png" } },
    "android": { "adaptiveIcon": { "foregroundImage": "./assets/adaptive-icon.png", "monochromeImage": "./assets/adaptive-icon-monochrome.png", "backgroundColor": "#6D42E8" } },
    "web": { "favicon": "./assets/favicon.png" },
    "notification": { "icon": "./assets/notification-icon.png", "color": "#6D42E8" },
    "plugins": [["expo-splash-screen", { "image": "./assets/splash-icon.png", "imageWidth": 220, "resizeMode": "contain", "backgroundColor": "#FFFFFF", "dark": { "backgroundColor": "#0B0A0F" } }]]
  }
}
