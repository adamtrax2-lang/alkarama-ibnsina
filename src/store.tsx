import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import {
  umrahPacks as defaultUmrahPacks,
  umrahMoreDepartures as defaultUmrahMore,
  hotels as defaultHotels,
  business as defaultBusiness,
  type UmrahPack,
  type Hotel,
} from "./data";
import { supabase, isSupabaseConfigured, CONTENT_TABLE, CONTENT_ROW_ID } from "./supabase";

/*
  Content store = the single source of truth for everything the client can edit.

  Two modes, chosen automatically by whether Supabase keys are present (see supabase.ts):
    CLOUD  (keys set)  -> reads/writes one row in the Supabase `site_content` table.
                          Every visitor on every device sees the same edits.
    LOCAL  (no keys)   -> reads/writes the browser's localStorage. Edits stay on that
                          one browser. Used for the offline demo before the DB is set up.

  Either way the rest of the app only calls useContent(); it never knows which mode is on.
  Moving fully to the cloud is just adding the two keys, no code change anywhere else.
*/

export type Business = typeof defaultBusiness;

export type Content = {
  umrahPacks: UmrahPack[];
  umrahMoreDepartures: UmrahPack[];
  hotels: Hotel[];
  business: Business;
};

const STORAGE_KEY = "alkarama_content_v1";

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

// A fresh deep copy of the defaults each time, so edits never mutate the imported arrays.
function makeDefaults(): Content {
  return clone({
    umrahPacks: defaultUmrahPacks,
    umrahMoreDepartures: defaultUmrahMore,
    hotels: defaultHotels,
    business: defaultBusiness,
  });
}

function loadLocal(): Content {
  const defaults = makeDefaults();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    // shallow-merge so any newly added default section survives an old saved payload
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

export type SaveResult = { ok: boolean; error?: string };

type Ctx = {
  content: Content;
  save: (next: Content) => Promise<SaveResult>;
  reset: () => Promise<void>;
  loading: boolean; // true while the initial cloud fetch is in flight
  source: "cloud" | "local";
};

const ContentContext = createContext<Ctx | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  // In cloud mode start from defaults and hydrate from the DB right after; in local mode read storage now.
  const [content, setContent] = useState<Content>(() => (isSupabaseConfigured ? makeDefaults() : loadLocal()));
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);

  // Cloud mode: pull the saved content once on mount.
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from(CONTENT_TABLE)
        .select("data")
        .eq("id", CONTENT_ROW_ID)
        .maybeSingle();
      if (cancelled) return;
      if (!error && data?.data) {
        setContent({ ...makeDefaults(), ...(data.data as Content) });
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const save = useCallback(async (next: Content): Promise<SaveResult> => {
    setContent(next);
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from(CONTENT_TABLE)
        .upsert({ id: CONTENT_ROW_ID, data: next, updated_at: new Date().toISOString() });
      return error ? { ok: false, error: error.message } : { ok: true };
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore quota / private-mode errors; the in-memory copy still updates the site */
    }
    return { ok: true };
  }, []);

  const reset = useCallback(async () => {
    const defaults = makeDefaults();
    setContent(defaults);
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from(CONTENT_TABLE)
        .upsert({ id: CONTENT_ROW_ID, data: defaults, updated_at: new Date().toISOString() });
    } else {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }
  }, []);

  return (
    <ContentContext.Provider
      value={{ content, save, reset, loading, source: isSupabaseConfigured ? "cloud" : "local" }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within a ContentProvider");
  return ctx;
}
