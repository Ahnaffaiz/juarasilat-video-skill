# CTA Follow reusable

Overlay berlatar transparan untuk Juara Silat, dibuat ulang dari animasi CTA film Azrul. Latar laga sengaja tidak disertakan.

| File | Kegunaan |
|---|---|
| `follow-overlay.mov` | ProRes 4444 dengan alfa, untuk editor video |
| `follow-overlay.webm` | VP9 dengan alfa, untuk komposisi web/kode |
| `cta.js` | Fungsi `drawBackground` dan `drawForeground`; ubah latar, teks, handle, situs, atau tap |
| `index.html` | Render transparan siap pakai |
| `render_alpha.mjs` | Bangun ulang MOV, WebM, dan preview dari kode |
| `timing.json` | Waktu avatar, cincin, tombol, chip, tap, dan chime |
| `preview.png` | Contoh satu frame dengan kanal alfa |

Kanvas 1080×1920 pada 30 fps. Overlay berisi subtitle untuk kalimat CTA standar. Jika narasi CTA berubah, sesuaikan fungsi `caption()` di `cta.js`, lalu render ulang. Musik, suara, dan SFX tersedia terpisah di `../../audio/cta-follow/`; overlay video ini tidak memiliki audio.

Contoh dengan footage yang telah disiapkan sebagai latar 1080×1920:

```sh
ffmpeg -i background.mp4 -i follow-overlay.mov -i ../../audio/cta-follow/follow-full.wav \
  -filter_complex '[0:v][1:v]overlay=0:0:format=auto:shortest=1[v]' \
  -map '[v]' -map 2:a -c:v libx264 -crf 15 -pix_fmt yuv420p -c:a aac -shortest cta-final.mp4
```

Untuk hasil yang paling dekat dengan film Azrul, buramkan footage latar lalu gunakan overlay ini; `drawBackground()` dalam `cta.js` sudah memberi blur 26 px saat dipakai melalui kode.
