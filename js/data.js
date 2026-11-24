/* ==========================================================
   DATA PORTOFOLIO
   Ganti isi file ini dengan data kamu sendiri.
   Semua teks, link, dan gambar di website dibaca dari sini,
   jadi kamu tidak perlu mengubah index.html / main.js.
   ========================================================== */

const SITE = {
  name: "Zakky Zakaria",
  firstName: "Zakky",
  lastName: "Zakaria",
  title: "Zakky Zakaria | Portofolio",
  email: "zakkyzkr36@gmail.com", // tujuan form "Hubungi"
  cvUrl: "#", // ganti dengan link CV (mis. assets/cv.pdf atau link Google Drive)
  avatar: "assets/avatar.svg",
  bio:
    "Mahasiswa Teknologi Yogyakarta, ilustrator freelance, videografer, dan " +
    "video editor. Saya mengubah ide menjadi visual, cerita, dan karya digital yang berdampak.",

  supabase: {
    url: "https://stllxnbkinjatirrzjxo.supabase.co",
    // Format baru Supabase Publishable Key (sb_publishable_...) — sudah benar ✓
    publishableKey: "sb_publishable_5nGfZ4fcQzKra9W7qsZ5FQ_1vk5W9JR",
    adminEmail: "zakkyzkr36@gmail.com",
  },

  socials: [
    { name: "Instagram", icon: "instagram", label: "Instagram", sub: "@zkyzakariaa", url: "https://www.instagram.com/zkyzakariaa" },
  ],
  contactPhoto: "assets/award-2.svg",

  education: [
    {
      org: "Universitas Contoh",
      role: "Data Science",
      meta: "Fakultas Teknologi",
      tag: "Undergraduate",
      date: "2026 – Sekarang",
      logo: "UC",
    },
    {
      org: "SMA Negeri 1 Contoh",
      role: "Ilmu Pengetahuan Alam",
      meta: "High School",
      tag: "IPA",
      date: "2023 – 2026",
      logo: "SM",
    },
  ],

  experience: [
    { org: "Komunitas Coding Kampus", role: "Anggota", meta: "Universitas Contoh", tag: "Community", date: "2026", logo: "KC" },
    { org: "Panitia Hackathon", role: "Staff Teknologi / UI/UX Designer", meta: "Fakultas", tag: "Committee", date: "2026", logo: "PH" },
    { org: "Seminar Pemrograman", role: "Pemateri Pemrograman Dasar", meta: "Universitas Contoh", tag: "Speaker", date: "2026", logo: "SP" },
    { org: "Perusahaan Contoh", role: "UI/UX Designer", meta: "Kota Kamu", tag: "Internship", date: "2025", logo: "PC" },
  ],

  projects: [],

  certificates: [],

  // x, y dalam persen dari area "stage"; rot = kemiringan (derajat)
  awards: [],
};
