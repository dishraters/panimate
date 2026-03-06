# Panimate Diagnosis Report

## Issues Found

### 1. **ANIMATION NOT RENDERING** (card/[id]/page.tsx - CRITICAL)
**Problem:** The Player component renders with absolute positioning inside a relative container, but the animation gets hidden behind other UI elements.

**Location:** Lines 124-128 in `src/app/card/[id]/page.tsx`

```tsx
<Player
  autoplay
  loop
  src="/animations/celebration.json"
  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.7 }}
/>
```

**Why it breaks:**
- Player is absolutely positioned with `inset: 0` (covers entire parent)
- Message text/box comes AFTER Player in DOM (renders on top)
- Parent has `overflow-hidden`, clipping the animation
- The message div has `relative z-10`, which layers above the animation
- Animation is set to `opacity: 0.7`, making it nearly invisible behind text

**Fix needed:**
- Move Player BEFORE the message content in DOM
- OR: Wrap Player in a separate positioned layer with lower z-index
- OR: Use `pointer-events: none` so it doesn't interfere with clicks
- Increase opacity or adjust rendering strategy

---

### 2. **RECORDING AUDIO BLOB NOT PERSISTED** (create/page.tsx - CRITICAL)
**Problem:** Audio blob is created as a client-side object URL, but when saved to Supabase, the blob doesn't persist across page navigations or browser sessions.

**Location:** Lines 421-436 in `src/app/create/page.tsx`

```tsx
const audioObjectUrl = audioBlob ? URL.createObjectURL(audioBlob) : ''

const { data, error } = await supabase
  .from('cards')
  .insert({
    id: cardId,
    transcript: transcript.trim(),
    category: selectedTheme.id,
    tier: selectedTier,
    audio_url: audioObjectUrl || null,  // ❌ THIS IS WRONG
    animations: isPro ? ['celebration'] : []
  })
```

**Why it breaks:**
- `URL.createObjectURL()` creates a temporary blob URL (e.g., `blob:http://localhost:3000/...`)
- This URL is **only valid in the current browser session**
- When you navigate away or close the browser, the blob reference is destroyed
- Saving this URL to Supabase is useless—it won't work later or on other devices
- The audio is never actually uploaded to storage

**Expected behavior:**
- Convert audioBlob to base64 OR upload to Supabase Storage
- Store the persistent URL (not the blob: URL)

**Fix needed:**
- Upload audioBlob to Supabase Storage bucket
- Get the public/signed URL from Storage
- Save THAT URL to the `cards` table
- OR: Convert blob to base64 and store as data URL (less ideal for large files)

---

### 3. **SUPABASE TABLE SCHEMA MISMATCH** (Minor)
The `audio_url` column is being written to, but there's no confirmation it exists in the Supabase schema. If the table was created without this column, the insert will fail silently or throw an error.

**Check needed:**
- Verify Supabase `cards` table has columns: `id`, `transcript`, `category`, `tier`, `animations`, `audio_url`

---

## Latest Commits Context
- `cc7187c` - "fix: Always render animation on cards"
- `883c10f` - "fix: Save animations to Supabase and render on result card"

The recent fixes attempted to address these but didn't solve the core issues.

---

## Summary

| Issue | Severity | Type | Impact |
|-------|----------|------|--------|
| Animation hidden behind UI | CRITICAL | Layout/Rendering | Animations don't show at all |
| Audio blob not persisted | CRITICAL | Data Flow | Recording data lost after nav |
| Table schema unclear | HIGH | Database | Inserts may fail silently |

