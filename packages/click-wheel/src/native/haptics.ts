import * as Haptics from "expo-haptics";

/** One short tick per detent. Not on Expo? Replace this file with your own haptics call. */
export function haptic(): void {
  void Haptics.selectionAsync();
}
