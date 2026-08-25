import { createMMKV } from "react-native-mmkv";

/** Synchronous local key-value store. Data never leaves the device. */
export const mmkv = createMMKV({ id: "neurotrace-storage" });
