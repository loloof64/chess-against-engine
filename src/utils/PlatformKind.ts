export enum PlatformKind {
  desktop,
  android,
}

function getPlatformKind(): PlatformKind {
  // Check if running on Android
  if (/Android/i.test(navigator.userAgent)) {
    return PlatformKind.android;
  }
  // Default to desktop for Tauri app
  return PlatformKind.desktop;
}

export default getPlatformKind;
