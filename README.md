# JuaraSilat Video Skill

Skill Codex untuk membuat video bedah teknik pencak silat vertikal 9:16 dengan identitas visual **Juara Silat**. Paket ini menyatukan alur analisis pertandingan per frame, penulisan naskah, produksi voice-over, visual Sports Telestrator, mixing audio, render, dan quality assurance.

> Skill ini dibuat untuk workflow produksi Juara Silat. Pipeline render bergantung pada **Lemo-Opuscar** dan beberapa alat lokal; paket ini bukan aplikasi video mandiri.

## Fungsi utama

- Menganalisis footage pertandingan per frame dan memilih satu teknik utama dari satu atlet.
- Menyusun tabel fakta/fase agar setiap klaim dalam naskah dapat diverifikasi pada frame.
- Menulis naskah sekitar 200–230 kata dengan gaya pelatih yang serius, tegas, dan ringkas.
- Menyiapkan voice-over ElevenLabs, pemotongan per kalimat, dan verifikasi transkrip dengan Whisper.
- Membuat film vertikal 1080×1920 bergaya Sports Telestrator: full-bleed, coretan teknik, kartu kaca, stabilo merah, subtitle, watermark, dan CTA beranimasi.
- Menjaga hook tetap berfokus pada tesis teknik utama dan memakai nama atlet secara konsisten setelah identitasnya diketahui.
- Memeriksa headline agar tidak terpotong, blok merah subtitle agar selalu menutup tepat satu kata utuh, memilih freeze dari beberapa frame sumber paling tajam, dan mengkalibrasi coretan pada anatomi di frame aktual.
- Mengaudit 1 detik awal setiap baris pada source, stem, dan master untuk false start yang dapat disembunyikan Whisper. Jika sumber memiliki fragmen palsu, pilih take bersih atau lakukan sweep onset 20 milidetik; `preserve_full_take` hanya dipakai setelah sumber benar-benar terdengar bersih.
- Menampilkan kredit layar hanya ketika URL/channel sumber eksplisit dan terverifikasi; watermark baku berukuran ±190 px dengan opasitas ±20% pada kanvas 1080.
- Menginterpolasi serta meningkatkan resolusi frame dengan pipeline VideoToolbox.
- Melakukan QA visual dan audio, termasuk contact sheet, deteksi frame hitam, subtitle, loudness, dan true peak.
- Menghasilkan paket akhir berupa video MP4, subtitle SRT, poster, treatment, fakta analisis, dan kredit.

## Isi paket

File [`juarasilat-video.skill`](./juarasilat-video.skill) adalah arsip skill yang berisi:

- `SKILL.md` — instruksi utama dan aturan workflow.
- `references/` — panduan analisis, naskah, gaya bahasa, suara, visual, branding, build, dan evaluasi.
- `scripts/` — pembuat proyek baru dan generator contact sheet.
- `assets/film-template/` — template film, build script, mixer audio, pemotong voice-over, subtitle, master HQ, font, dan logo.
- `assets/examples/azrul-fitrah/` — contoh treatment, fakta, naskah, kredit, dan poster.

## Kebutuhan

### Sistem

- Codex desktop, Codex CLI, atau ekstensi IDE yang mendukung Skills.
- macOS 26 atau lebih baru untuk pipeline `vtenh` berbasis AVFoundation, VideoToolbox, CoreImage, dan CoreVideo.
- Mesin dengan RAM 8 GB dapat digunakan dengan batas dua worker render dan hanya satu proses berat pada satu waktu.
- Ruang penyimpanan yang cukup untuk footage sumber dan rangkaian frame hasil interpolasi/super-resolution.

### Perangkat lunak

- Lemo-Opuscar terpasang secara lokal beserta virtual environment Python-nya.
- Node.js.
- FFmpeg dan FFprobe.
- `yt-dlp` untuk mengambil footage dari URL ketika pengguna memang mengizinkannya.
- Xcode Command Line Tools (`swiftc`).
- Paket Python di environment Lemo-Opuscar: `numpy`, `Pillow`, `soundfile`, `soxr`, dan `faster-whisper`.
- Koneksi ElevenLabs dengan model `eleven_v4`, akses suara Bambang, dan kredit yang mencukupi.

Instal alat umum di macOS dengan Homebrew:

```bash
brew install node ffmpeg yt-dlp
xcode-select --install
```

Atur lokasi Lemo-Opuscar. Tanpa variabel ini, script memakai lokasi default `/Users/ahnaf/lemo-opuscar`:

```bash
export LIB="/path/absolut/ke/lemo-opuscar"
"$LIB/.venv/bin/pip" install numpy Pillow soundfile soxr faster-whisper
```

## Instalasi skill

Menurut [dokumentasi resmi OpenAI tentang Skills](https://learn.chatgpt.com/docs/build-skills), Codex memuat skill personal dari `$HOME/.agents/skills` dan skill proyek dari `.agents/skills` di dalam repository.

### Instalasi personal

Skill tersedia untuk semua proyek milik pengguna:

```bash
git clone https://github.com/Ahnaffaiz/juarasilat-video-skill.git
mkdir -p "$HOME/.agents/skills"
unzip -o juarasilat-video-skill/juarasilat-video.skill -d "$HOME/.agents/skills"
```

Struktur akhirnya harus seperti ini:

```text
$HOME/.agents/skills/
└── juarasilat-video/
    ├── SKILL.md
    ├── references/
    ├── scripts/
    └── assets/
```

### Instalasi untuk satu repository

Jalankan dari root repository tujuan:

```bash
mkdir -p .agents/skills
unzip -o /path/ke/juarasilat-video.skill -d .agents/skills
```

Codex biasanya mendeteksi perubahan skill secara otomatis. Jika skill belum terlihat, restart Codex, buka daftar Skills, atau jalankan `/skills` di Codex CLI.

## Cara menggunakan

Panggil skill secara eksplisit:

```text
$juarasilat-video
Bedah teknik dari https://youtube.com/... dan fokus pada jatuhan atlet merah pada ronde kedua.
```

Skill juga dapat aktif otomatis ketika permintaan menyebut video Juara Silat, bedah teknik, analisis jatuhan/tendangan/sapuan, Reels, TikTok, Shorts, voice-over, atau aturan brand Juara Silat.

Alur produksinya:

1. Berikan URL pertandingan, atlet atau momen yang ingin dianalisis, dan pastikan izin penggunaan footage.
2. Skill membuat proyek dari template.
3. Footage dianalisis per frame dan dicatat ke `FACTS.md`.
4. Naskah, highlight, voice-over, visual telestrator, dan audio dibangun secara berurutan.
5. Pipeline merender video, subtitle, dan poster, lalu menjalankan QA.

Untuk membuat proyek secara manual dari template:

```bash
sh "$HOME/.agents/skills/juarasilat-video/scripts/new_film.sh" \
  sapuan-cerdas-atlet \
  /path/ke/folder-proyek \
  "https://youtube.com/..."
```

URL bersifat opsional. Jangan menyertakannya bila footage sudah tersedia secara lokal atau belum ada izin untuk mengunduh.

## Output

Setiap produksi ditujukan menghasilkan:

- `<nama>.mp4` — master video vertikal.
- `<nama>.srt` — subtitle.
- `poster.jpg` — poster/thumbnail.
- `TREATMENT.md` — treatment kreatif.
- `FACTS.md` — fakta dan tabel fase hasil analisis.
- `CREDITS` — kredit sumber dan produksi.

## Catatan operasional

- Satu video membahas satu teknik dari satu atlet, bukan rangkuman pertandingan atau berita skor.
- Jalankan `vtenh`, Whisper medium, dan render secara bergantian pada mesin 8 GB.
- Build template membatasi render ke dua worker.
- ElevenLabs memakai kredit berbayar; catat pemakaiannya pada penyerahan hasil.
- Pengunduhan dan penggunaan footage tunduk pada lisensi sumber. Video YouTube berlisensi standar dapat memicu klaim Content ID; tanggung jawab izin tetap berada pada pemilik konten.

## Integritas paket

SHA-256 `juarasilat-video.skill`:

```text
5455445d62bbc78bf1533735e220ae2afcfef827ed43490b80bf74b0ec7933b8
```
