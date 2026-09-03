import AsyncStorage from "@react-native-async-storage/async-storage";
import type { VesselDetail, VesselSummary } from "./types";

/**
 * Last-known server state, on disk.
 *
 * Without this the app is a blank screen the moment the signal drops, which is
 * exactly when a supervisor is most likely to open it. Cached data is shown
 * immediately and then replaced when the network answers — so the screen is
 * never empty and never blocks on a request that may take 30 seconds to wake
 * a sleeping server.
 *
 * The cache is not the truth. Anything read from here is stale by definition
 * and is stamped with when it was fetched so the UI can say so.
 */

const LIST_KEY = "cleantrack.cache.vessels.v1";
const DETAIL_KEY = (id: number) => `cleantrack.cache.vessel.${id}.v1`;

export type Cached<T> = { data: T; fetchedAt: string };

async function read<T>(key: string): Promise<Cached<T> | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Cached<T>) : null;
  } catch {
    return null;
  }
}

async function write<T>(key: string, data: T) {
  try {
    await AsyncStorage.setItem(
      key,
      JSON.stringify({ data, fetchedAt: new Date().toISOString() }),
    );
  } catch {
    /* A full disk must not break the app; the network copy still works. */
  }
}

export const readVessels = () => read<VesselSummary[]>(LIST_KEY);
export const writeVessels = (v: VesselSummary[]) => write(LIST_KEY, v);

export const readVessel = (id: number) => read<VesselDetail>(DETAIL_KEY(id));
export const writeVessel = (v: VesselDetail) => write(DETAIL_KEY(v.id), v);

/** Called on sign-out. Another supervisor may use this handset. */
export async function clearCache() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const ours = keys.filter((k) => k.startsWith("cleantrack.cache."));
    if (ours.length) await AsyncStorage.multiRemove(ours);
  } catch {
    /* Nothing to do; the next sign-in overwrites it anyway. */
  }
}
