import axios from 'axios'

const API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATION_API_KEY
const ENDPOINT = 'https://translation.googleapis.com/language/translate/v2'

// In-memory cache for fast access during session
const memoryCache = new Map()

// Cache key generator
function getCacheKey(text, targetLang, sourceLang) {
  return `${sourceLang}:${targetLang}:${text}`
}

// Get from localStorage
function getFromLocalStorage(key) {
  try {
    const stored = localStorage.getItem(`translate_${key}`)
    if (stored) {
      const { value, timestamp } = JSON.parse(stored)
      // Cache valid for 7 days
      const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000
      if (Date.now() - timestamp < CACHE_DURATION) {
        return value
      } else {
        localStorage.removeItem(`translate_${key}`)
      }
    }
  } catch (e) {
    console.warn('LocalStorage read error:', e)
  }
  return null
}

// Save to localStorage
function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(
      `translate_${key}`,
      JSON.stringify({
        value,
        timestamp: Date.now(),
      }),
    )
  } catch (e) {
    console.warn('LocalStorage write error:', e)
  }
}

export async function translateText(text, targetLang, sourceLang = 'en') {
  // If target is same as source, return original
  if (targetLang === sourceLang) {
    return text
  }

  const cacheKey = getCacheKey(text, targetLang, sourceLang)

  // Check memory cache first
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey)
  }

  // Check localStorage
  const cachedValue = getFromLocalStorage(cacheKey)
  if (cachedValue) {
    memoryCache.set(cacheKey, cachedValue)
    return cachedValue
  }

  // Call API
  const response = await axios.post(`${ENDPOINT}?key=${API_KEY}`, {
    q: text,
    source: sourceLang,
    target: targetLang,
    format: 'text',
  })

  const translated = response.data.data.translations[0].translatedText

  // Save to both caches
  memoryCache.set(cacheKey, translated)
  saveToLocalStorage(cacheKey, translated)

  return translated
}

export async function translateBatch(texts, targetLang, sourceLang = 'en') {
  // If target is same as source, return original
  if (targetLang === sourceLang) {
    return texts
  }

  const results = []
  const textsToTranslate = []
  const indicesToTranslate = []

  // Check cache for each text
  texts.forEach((text, index) => {
    const cacheKey = getCacheKey(text, targetLang, sourceLang)

    // Check memory cache
    if (memoryCache.has(cacheKey)) {
      results[index] = memoryCache.get(cacheKey)
      return
    }

    // Check localStorage
    const cachedValue = getFromLocalStorage(cacheKey)
    if (cachedValue) {
      memoryCache.set(cacheKey, cachedValue)
      results[index] = cachedValue
      return
    }

    // Need to translate this one
    textsToTranslate.push(text)
    indicesToTranslate.push(index)
  })

  // If all were cached, return results
  if (textsToTranslate.length === 0) {
    return results
  }

  // Translate remaining texts
  const response = await axios.post(`${ENDPOINT}?key=${API_KEY}`, {
    q: textsToTranslate,
    source: sourceLang,
    target: targetLang,
    format: 'text',
  })

  const translations = response.data.data.translations.map((t) => t.translatedText)

  // Save to cache and fill results
  translations.forEach((translated, i) => {
    const originalIndex = indicesToTranslate[i]
    const originalText = textsToTranslate[i]
    const cacheKey = getCacheKey(originalText, targetLang, sourceLang)

    memoryCache.set(cacheKey, translated)
    saveToLocalStorage(cacheKey, translated)
    results[originalIndex] = translated
  })

  return results
}

// Clear old cache entries (optional utility function)
export function clearOldTranslationCache() {
  try {
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('translate_')) {
        const stored = localStorage.getItem(key)
        if (stored) {
          const { timestamp } = JSON.parse(stored)
          const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000
          if (Date.now() - timestamp >= CACHE_DURATION) {
            keysToRemove.push(key)
          }
        }
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key))
    console.log(`Cleared ${keysToRemove.length} old translation cache entries`)
  } catch (e) {
    console.warn('Cache cleanup error:', e)
  }
}
