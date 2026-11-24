# PemroAi — Website Portofolio

Website portofolio satu halaman (HTML + CSS + JavaScript biasa, tanpa framework, tanpa install apa pun).

## Cara menjalankan
Klik dua kali `index.html`, atau di VS Code pakai ekstensi **Live Server** (klik kanan `index.html` → *Open with Live Server*).

## Struktur folder
```
PemroAi/
├── index.html        # kerangka halaman (Home, About, Portfolio, Contact)
├── css/style.css     # semua tampilan
├── js/
│   ├── data.js       # ← ISI DATA KAMU DI SINI (nama, bio, proyek, sertifikat, dll.)
│   └── main.js       # logika: navbar, carousel, folder, komentar, dll.
└── assets/           # gambar placeholder (SVG) — ganti dengan foto kamu
```

## Cara mengganti isi
1. Buka `js/data.js`, ganti nama, bio, email, link sosial media, pendidikan, pengalaman.
2. Tambah/ubah proyek, sertifikat, penghargaan di array `projects`, `certificates`, `awards`.
3. Taruh foto kamu di `assets/` lalu ubah path-nya di `data.js`
   (mis. `avatar: "assets/foto-saya.png"`). Foto profil paling bagus berlatar transparan (PNG).
4. Ganti gambar latar Home dengan menimpa `assets/hero.svg` (atau ubah path di `css/style.css`, bagian `.home`).
5. Link CV: isi `cvUrl` di `data.js`.

## Fitur
- Navbar pill dengan maskot yang berpindah dan matanya mengikuti kursor; tema terang/gelap otomatis mengikuti section.
- Timeline Education & Experience yang menyala saat di-scroll.
- Folder Projects / Certificates / Awards (klik untuk loncat ke tab-nya).
- Carousel proyek & sertifikat (tombol panah, geser, atau panah keyboard), modal Details / View Certificate.
- Awards berupa foto polaroid yang bisa digeser.
- Form "Hubungi" membuka aplikasi email (mailto). Form komentar menyimpan ke `localStorage`.

## Catatan penting
- **Komentar hanya tersimpan di browser masing-masing pengunjung** (localStorage), jadi komentar orang lain tidak akan terlihat. Untuk komentar yang dilihat semua orang butuh backend, misalnya Firebase Firestore atau Supabase.
- Form "Hubungi" memakai `mailto:`. Untuk kirim tanpa membuka aplikasi email, bisa pakai layanan seperti Formspree atau EmailJS.
- Font Inter dimuat dari Google Fonts; kalau offline, otomatis pakai font bawaan sistem.
- Untuk online gratis: upload folder ini ke Vercel, Netlify, atau GitHub Pages.
