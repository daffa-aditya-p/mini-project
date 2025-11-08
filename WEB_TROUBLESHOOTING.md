# TROUBLESHOOTING WEB BUILD - MOBILE

## MASALAH YANG DITEMUKAN

### 1. HTTP 404 Errors
```
Failed to load resource: the server responded with a status of 404
- https://pygame-web.github.io/archives/0.9/cpython312/main.js
- https://pygame-web.github.io/archives/0.9/cpython312/main.data  
- https://pygame-web.github.io/archives/0.9/cpython312/main.wasm
- https://pygame-web.github.io/archives/0.9/browserfs.min.js.map
```

**PENYEBAB:**
- Pygbag build TIDAK bundle WASM files locally
- Hanya generate HTML stub yang load dari CDN pygame-web.github.io
- CDN sedang DOWN atau URL archived version 0.9 tidak valid lagi
- Browser gagal fetch files dari remote

### 2. MEDIA USER ACTION REQUIRED
```
** MEDIA USER ACTION REQUIRED [#] **
Repeated Promise.catch traces in pythons.js
```

**PENYEBAB:**
- Browser mobile (Chrome Android) BLOCK autoplay audio/video tanpa user gesture
- Pygame mixer.init() dipanggil otomatis saat load
- Browser refuse dan throw error berulang kali
- Loop error karena Pygbag retry init audio terus menerus

### 3. Device Pixel Ratio Warning
```
Unsupported device pixel ratio 2.15625
```

**PENYEBAB:**
- Android device punya high-DPI screen (2.15625x)
- Pygame WASM belum fully support non-standard DPR
- Tidak critical tapi bisa bikin rendering scaling aneh

---

## SOLUSI & WORKAROUNDS

### SOLUSI 1: Gunakan mobile-fix.html (RECOMMENDED)

File ini sudah saya buat di `build/web/mobile-fix.html`

**Cara pakai:**
```bash
cd build/web
python3 -m http.server 8000
```

Lalu buka di browser mobile:
```
http://localhost:8000/mobile-fix.html
```

**Fitur mobile-fix.html:**
- ✅ Unlock audio setelah user tap button
- ✅ CDN availability check
- ✅ Loading indicator
- ✅ Error handling dengan retry
- ✅ Responsive design untuk mobile
- ✅ Iframe wrapper untuk isolasi context

**Cara kerja:**
1. Cek apakah CDN pygame-web tersedia
2. Tampilkan button "TAP TO START"
3. Saat user tap → unlock audio context
4. Load game di iframe
5. Audio autoplay sekarang allowed karena ada user gesture

---

### SOLUSI 2: Patch index.html untuk Disable Audio

Kalau mau pakai `index.html` asli tapi tanpa audio:

```bash
cd build/web
# Backup original
cp index.html index.html.backup

# Edit index.html, cari baris:
# data-os=vtx,fs,snd,gui

# Ganti jadi (remove 'snd'):
# data-os=vtx,fs,gui
```

**Manual edit:**
1. Buka `build/web/index.html`
2. Line 1, cari `data-os=vtx,fs,snd,gui`
3. Hapus `snd,` → jadi `data-os=vtx,fs,gui`
4. Save dan reload

Ini akan **disable audio completely**, tapi game tetap jalan tanpa loop error.

---

### SOLUSI 3: Host WASM Files Locally (ADVANCED)

Download WASM files dari CDN dan host sendiri:

```bash
cd build/web

# Download Python WASM runtime
mkdir -p cpython312
cd cpython312

# Download files (ganti URL jika CDN berbeda)
wget https://pygame-web.github.io/archives/0.9/cpython312/main.js
wget https://pygame-web.github.io/archives/0.9/cpython312/main.data
wget https://pygame-web.github.io/archives/0.9/cpython312/main.wasm
wget https://pygame-web.github.io/archives/0.9/cpython312/main.wasm.map

cd ..

# Edit index.html, ganti semua URL dari:
# https://pygame-web.github.io/archives/0.9/
# jadi:
# ./
```

**Benefit:**
- Tidak depend on external CDN
- Faster loading (local files)
- Works offline

**Drawback:**
- Files besar (~50MB total)
- Perlu manual update jika Pygbag version berubah

---

### SOLUSI 4: Deploy ke Hosting dengan CORS/Headers Benar

Kalau serve dengan `python -m http.server`, beberapa headers mungkin kurang.

**Gunakan server dengan config lengkap:**

**Opsi A - Nginx:**
```nginx
server {
    listen 8000;
    server_name localhost;
    
    root /path/to/build/web;
    index index.html;
    
    # CORS headers
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
    add_header Cross-Origin-Opener-Policy same-origin;
    add_header Cross-Origin-Embedder-Policy require-corp;
    
    # MIME types
    types {
        application/wasm wasm;
        application/javascript js;
        application/json json;
    }
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

**Opsi B - Python server dengan custom headers:**
```python
# serve_game.py
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        SimpleHTTPRequestHandler.end_headers(self)

os.chdir('build/web')
httpd = HTTPServer(('0.0.0.0', 8000), CORSRequestHandler)
print('Serving on http://localhost:8000')
httpd.serve_forever()
```

Jalankan:
```bash
python3 serve_game.py
```

---

## DEBUGGING CHECKLIST

### 1. Cek CDN Accessibility
```bash
curl -I https://pygame-web.github.io/archives/0.9/pythons.js
```

Expected: `200 OK`  
Jika 404: CDN down/URL changed

### 2. Cek Local Files
```bash
cd build/web
ls -lh
```

Expected files:
- `index.html` (~11-15 KB)
- `mini-project.apk` (~20-50 KB)
- `favicon.png`
- `mobile-fix.html` (baru dibuat)

### 3. Cek Browser Console (F12)
Buka DevTools → Console, cari:
- Red errors (404, CORS, etc)
- Warnings tentang audio autoplay
- Promise rejection traces

### 4. Cek Network Tab
DevTools → Network:
- Cari requests ke `pygame-web.github.io`
- Cek status code (200 = OK, 404 = not found)
- Cek size (jika 0 bytes = blocked/failed)

### 5. Test Audio Unlock
Di console, run:
```javascript
const ctx = new AudioContext();
console.log('Audio context state:', ctx.state);
// Harusnya 'running' setelah user tap
```

---

## NEXT STEPS

### Untuk Development (Local Testing):
1. Gunakan `mobile-fix.html` untuk bypass audio issue
2. Atau disable audio di `index.html` (remove `snd` flag)

### Untuk Production (Deploy):
1. **GitHub Pages** (easiest):
   ```bash
   # Push build/web/ to gh-pages branch
   git checkout -b gh-pages
   git add build/web/*
   git commit -m "Deploy web build"
   git push origin gh-pages
   ```
   Access: `https://username.github.io/repo-name/build/web/mobile-fix.html`

2. **Netlify/Vercel**:
   - Drag & drop folder `build/web/`
   - Auto handle CORS/headers
   - Free SSL + CDN

3. **Itch.io** (gaming platform):
   ```bash
   cd build
   zip -r game.zip web/
   # Upload game.zip ke itch.io (HTML5 game type)
   ```

---

## KNOWN ISSUES & LIMITATIONS

### Pygame WASM Maturity:
- ❌ Audio autoplay blocked di mobile (by design browser)
- ❌ CDN dependency (pygame-web.github.io single point of failure)
- ⚠️ Large bundle size (~50MB WASM files)
- ⚠️ Tidak semua pygame features supported

### Mobile Browser Quirks:
- iOS Safari: stricter audio policy
- Android Chrome: high DPR warning
- Both: require fullscreen/viewport tweaks

### Performance:
- First load: ~10-30 seconds (download WASM)
- Subsequent: fast (cached)
- FPS bisa turun di low-end devices

---

## RECOMMENDED APPROACH

**Untuk testing sekarang:**
```bash
cd /workspaces/mini-project/build/web
python3 -m http.server 8000
# Buka: http://localhost:8000/mobile-fix.html
```

**Untuk production:**
1. Deploy ke Netlify (free, fast, no config)
2. Atau pakai mobile-fix.html di GitHub Pages
3. Dokumentasikan ke user: "Tap to start" untuk unlock audio

**Alternative (jika WASM masalah terus):**
- Build native Android APK pakai Buildozer (sudah ready di repo)
- Atau pakai Pygame desktop version di PC

---

## CONTACT & SUPPORT

Jika masih error:
1. Screenshot console errors (full red text)
2. Screenshot network tab (show failed requests)
3. Info device: Android version, Chrome version
4. URL yang kamu akses

Saya akan debugging lebih lanjut!
