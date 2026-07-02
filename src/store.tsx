import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  umrahPacks as defaultUmrahPacks,
  umrahMoreDepartures as defaultUmrahMore,
  hotels as defaultHotels,
  business as defaultBusiness,
  type UmrahPack,
  type Hotel,
} from "./data";

/*
  Content store = the single source of truth for everything the client can edit.

  Today it loads from src/data.ts (the defaults) and persists edits in the browser
  (localStorage). That makes the admin panel fully functional with zero accounts,
  which is what we need to demo it.

  When we move to a real database, ONLY the three functions below change
  (loadContent / persist / reset become Supabase calls). The admin panel and the
  public site read/write through useContent() and never touch storage directly, so
  they do not change at all.
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

function loadContent(): Content {
  const defaults = makeDefaults();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const saved = JSON.parse(raw);
    // shallow-merge so any newly added default section survives an old saved payload
    return { ...defaults, ...saved };
  } catch {
    return defaults;
  }
}

type Ctx = {
  content: Content;
  save: (next: Content) => void;
  reset: () => void;
};

const ContentContext = createContext<Ctx | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Content>(() => loadContent());

  const save = useCallback((next: Content) => {
    setContent(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore quota / private-mode errors, the in-memory copy still updates the site */
    }
  }, []);

  const reset = useCallback(() => {
    setContent(makeDefaults());
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <ContentContext.Provider value={{ content, save, reset }}>{children}</ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within a ContentProvider");
  return ctx;
}
