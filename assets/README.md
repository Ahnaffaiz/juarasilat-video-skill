# Aset reusable Juara Silat

Pustaka bersama untuk film baru. Ambil komponen dari sini; jangan salin potongan video CTA Azrul yang sudah berisi laga Azrul.

| Folder | Isi | Pemakaian |
|---|---|---|
| `brand/` | Logo merah dan putih | Avatar CTA dan watermark |
| `fonts/` | Plus Jakarta Sans dan Barlow Condensed | Judul, label, subtitle, CTA |
| `audio/cta-follow/` | CTA audio penuh, narasi, musik, dan jalur UI SFX terpisah | Pilih audio penuh bila kalimat CTA sama; pilih stem bila merekam CTA baru |
| `audio/music/` | Bed teknik D minor 16 detik yang dapat diulang | Letakkan pelan di bawah narasi pembahasan |
| `audio/sfx/` | One-shot Follow, chime, marker, dan hentakan freeze, serta skrip generator | Sinkronkan dengan `animation/cta-follow/timing.json` |
| `animation/cta-follow/` | Animasi CTA dengan alfa/transparansi, kode, font, logo, preview, timing | Tempel di atas footage baru; latar atlet tidak tertanam |
| `code/` | Primitif telestrator dan peningkatan frame tahan | Pakai untuk film berikutnya sesuai titik tubuh yang benar |

## CTA tanpa latar

`animation/cta-follow/follow-overlay.mov` adalah ProRes 4444 dengan kanal alfa untuk editor video. `follow-overlay.webm` adalah versi VP9 alfa yang lebih kecil. Keduanya 1080×1920, 30 fps, sekitar 5,97 detik. Latar pertandingan tidak tertanam; lapisan gelap transparan, cahaya merah, logo, tombol, ikon, situs, dan subtitle ada di dalam overlay.

Tempatkan footage atlet baru di bawah overlay. Gunakan `audio/cta-follow/follow-full.wav` bila narasi CTA persis **“Kalau kamu suka bedah teknik seperti ini, follow Juara Silat.”** Untuk kalimat lain, rekam narasi baru, pakai `follow-music.wav` dan `follow-ui.wav`, lalu sesuaikan subtitle dan waktu tap di `animation/cta-follow/cta.js`.

Untuk film yang dirender lewat kode, gambar footage baru lalu panggil:

```js
JuaraSilatFollowCTA.drawBackground(ctx, matchFrame, localTime);
JuaraSilatFollowCTA.drawForeground(ctx, localTime, logoRed, {
  handle: '@juarasilat', site: 'juarasilat.com', tap: 2.511,
});
```

`index.html` dalam folder CTA adalah contoh transparan yang bisa dirender ulang dengan `node render_alpha.mjs`; skrip itu memerlukan Lemo-Opuscar dan ffmpeg. Untuk overlay dengan footage yang sudah diburamkan sendiri, cukup panggil `drawForeground`.

## Aturan produksi

**Hook → video asli serangan → pembahasan → CTA.** Setelah hook, tampilkan 1–2 adegan teknik utuh pada kecepatan asli, tanpa freeze. Baru kemudian bedah fase taktik dengan potongan gerak dan frame tahan. Kesimpulan teknik berada di dalam pembahasan, sebelum CTA.

Pertahankan kedua atlet dari kepala hingga kaki pada adegan teknik. Pilih frame tahan yang paling jelas; `code/enhance_freeze.py input.jpg output.png` memberi pengurangan noise dan penajaman ringan. Periksa agar peningkatan itu tidak mengubah bentuk gerak.
