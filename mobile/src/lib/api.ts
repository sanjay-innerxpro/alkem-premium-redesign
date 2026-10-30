import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useCallback, useEffect, useState } from "react";
// Types are shared with the website so the app always matches what the API sends.
import type { Content, Settings } from "../../../src/lib/types";
import type { Dict, Lang } from "../../../src/lib/i18n";

export type { Lang };
export type Item = Omit<Content, "published" | "sortOrder">;
export type Site = {
  lang: Lang;
  dir: "ltr" | "rtl";
  languages: { code: Lang; label: string; short: string; dir: string }[];
  settings: Settings;
  dict: Dict;
};

export const SITE_URL: string = Constants.expoConfig?.extra?.siteUrl;

// Images may be stored as site paths ("/illustrations/x.svg") or full HTTPS URLs.
export const absolute = (url: string) =>
  !url
    ? ""
    : /^https?:\/\//.test(url)
      ? url
      : SITE_URL + "/" + url.replace(/^\//, "");

// Every successful response is saved, so the app still shows the last content offline.
async function load<T>(path: string): Promise<{ data: T; offline: boolean }> {
  const key = "api:" + path;
  try {
    const res = await fetch(SITE_URL + "/api/public" + path);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = (await res.json()) as T;
    AsyncStorage.setItem(key, JSON.stringify(data)).catch(() => {});
    return { data, offline: false };
  } catch (error) {
    const saved = await AsyncStorage.getItem(key).catch(() => null);
    if (saved) return { data: JSON.parse(saved) as T, offline: true };
    throw error;
  }
}

export function useApi<T>(path: string) {
  const [data, setData] = useState<T>();
  const [offline, setOffline] = useState(false);
  const [failed, setFailed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const run = useCallback(
    async (pull = false) => {
      if (pull) setRefreshing(true);
      try {
        const result = await load<T>(path);
        setData(result.data);
        setOffline(result.offline);
        setFailed(false);
      } catch {
        setFailed(true);
      } finally {
        setRefreshing(false);
      }
    },
    [path],
  );
  useEffect(() => {
    run();
  }, [run]);
  return { data, offline, failed, refreshing, refresh: () => run(true) };
}

export async function sendEnquiry(body: {
  name: string;
  email: string;
  subject: string;
  message: string;
  jobId?: string;
}) {
  const res = await fetch(SITE_URL + "/api/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (res.ok) return null;
  const json = await res.json().catch(() => ({}));
  return (json as { error?: string }).error ?? "HTTP " + res.status;
}
