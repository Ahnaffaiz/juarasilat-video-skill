# Gaya bersama Juara Silat

`style.js` memegang seluruh gaya yang dipakai ulang di semua film. Jangan menyalin isinya ke dalam
film; ikat sekali, lalu panggil seperti biasa.

```html
<script src="shared-assets/style/style.js"></script>
```

```js
const { wob, bez, plen, partial, marker, ring, loop, zone, dot, spot,
        shadowText, stabilo, rrect, glass } =
  JuaraSilatStyle.bind({ X, C, W, H, RED, COL, eo, hash, clamp, lerp });
```

| Kelompok | Isi | Catatan |
|---|---|---|
| Telestrator | `ring`, `loop`, `zone`, `dot`, `spot`, `marker`, `wob`, `bez` | `ring` selalu **lingkaran sempurna** |
| Tipografi | `shadowText`, `stabilo` | `stabilo` mengalikan `globalAlpha`, jadi blok selalu memudar bersama katanya |
| Kartu | `rrect`, `glass` | kartu kaca gelap, tanpa kilau putih |

`JuaraSilatStyle.TOKENS` memuat angka bakunya: batas bawah penanda bab, tier kartu, posisi subtitle,
nilai grade netral (tanpa color grading), dan penegasan bahwa kilatan transisi dimatikan.

Judul utama, judul bab, dan tata letak kartu memakai primitif di sini. Kalau sebuah gaya perlu diubah,
ubah di file ini supaya seluruh film ikut berubah — bukan di salah satu film.
