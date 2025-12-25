export enum PlatformKind {
  desktop,
  android,
  web,
}

function getPlatformKind(): PlatformKind {
  if (/Android/i.test(navigator.userAgent)) {
    return PlatformKind.android;
  }
  if (window && window.innerWidth !== undefined) {
    return PlatformKind.web;
  }
  return PlatformKind.desktop;
}

export default getPlatformKind;
