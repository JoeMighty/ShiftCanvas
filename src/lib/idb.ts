/**
 * IndexedDB keyval wrapper with automatic localStorage fallback.
 * Falls back gracefully if IndexedDB is unavailable (e.g. private browsing).
 */
import { openDB, type IDBPDatabase } from 'idb'

const DB_NAME = 'shiftcanvas'
const STORE = 'keyval'

const dbPromise: Promise<IDBPDatabase | null> = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE)) {
      db.createObjectStore(STORE)
    }
  },
}).catch(() => null)

function safeGetLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function safeSetLS(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch { /* ignore */ }
}

export async function idbGet<T>(key: string, fallback: T): Promise<T> {
  const db = await dbPromise
  if (!db) return safeGetLS(key, fallback)
  try {
    const val = await db.get(STORE, key)
    return val !== undefined ? (val as T) : fallback
  } catch {
    return safeGetLS(key, fallback)
  }
}

export async function idbSet(key: string, value: unknown): Promise<void> {
  const db = await dbPromise
  if (!db) { safeSetLS(key, value); return }
  try {
    await db.put(STORE, value, key)
  } catch {
    safeSetLS(key, value)
  }
}

export async function idbDelete(key: string): Promise<void> {
  const db = await dbPromise
  if (!db) { localStorage.removeItem(key); return }
  try {
    await db.delete(STORE, key)
  } catch {
    localStorage.removeItem(key)
  }
}

export async function idbGetAllKeys(): Promise<string[]> {
  const db = await dbPromise
  if (!db) return Object.keys(localStorage)
  try {
    return (await db.getAllKeys(STORE)) as string[]
  } catch {
    return []
  }
}
