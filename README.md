
# OmniCorp - Enterprise Management System

**OmniCorp Enterprise Management System** adalah platform SaaS *Enterprise Resource Planning* (ERP) full-stack premium yang dirancang untuk mengintegrasikan seluruh operasional bisnis dalam satu antarmuka modern, cepat, dan responsif. Dilengkapi dengan asisten bertenaga AI (*AI Co-Pilot*) menggunakan **Gemini API** untuk membantu analisis bisnis real-time secara interaktif.

---

## 🎨 Konsep Desain & Estetika (Visual Polish)
- **Elegant Slate & Contrast**: Menggunakan warna latar belakang ultra-bersih (`#F9FAFB`) yang dipadukan dengan panel elegan serta dukungan mode gelap (*Dark Mode Compatibility*).
- **Typography & Rhythm**: Menggunakan font sans-serif modern dengan penataan spasi (*generous negative space*) dan penekanan visual yang seimbang untuk keterbacaan yang maksimal.
- **Micro-interactions**: Transisi, animasi hover, serta indikator berbasis animasi halus (`motion`) menghadirkan interaksi aplikasi yang mulus dan intuitif.

---

## 🚀 Fitur Utama & Modul Aplikasi

### 1. 📊 Dashboard Utama (Overview ERP)
- **KPI Real-time**: Metrik performa bisnis utama seperti Saldo Operasional, Total Proyek Aktif, Jumlah Karyawan, dan Peringatan Menipisnya Stok.
- **Visualisasi Chart Indah**: Grafik performa Keuangan Bulanan interaktif dan sebaran staf karyawan per departemen berbasis Recharts.
- **Simulasi Input Arus Kas**: Form simulasi pencatatan arus kas secara instan yang langsung memperbarui tabel histori transaksi.
- **Log Audit Keamanan**: Rekaman aktivitas audit keamanan dan sistem secara dinamis.

### 2. 🛡️ Manajemen Pengguna (Access Control)
- Manajemen daftar Administrator dan Staff yang memiliki hak akses sistem.
- Status aktifasi, visual role tag yang dinamis, serta formulir interaktif untuk menambah dan mengedit pengguna.

### 3. 👥 Manajemen Karyawan (Human Resources)
- **KPI HR Lengkap**: Metrik headcount, rata-rata gaji pokok, persentase kehadiran kerja, dan rerata indeks penilaian KPI (Key Performance Indicator).
- **CRUD Karyawan**: Sistem manajemen lengkap untuk pendaftaran karyawan baru, perubahan jabatan/gaji, pencarian instan, serta integrasi filter departemen.

### 4. 🗂️ Manajemen Proyek & Kanban (Project Management)
- **Papan Kanban Interaktif**: Kelola siklus tugas proyek dengan transisi status yang responsif (To-Do, In Progress, Review, Done).
- Penambahan proyek ataupun tugas baru dilengkapi dengan konfigurasi prioritas serta bobot penyelesaian.

### 5. 🤝 CRM Pelanggan (Customer Relationship Management)
- Manajemen data *leads* dan prospek pelanggan baru secara end-to-end.
- Pengaturan prospek (New, Contacted, Proposal, Won, Lost), nilai potensi kesepakatan (*deal value*), dan estimasi penandatanganan kontrak.

### 6. 📦 Manajemen Inventaris (Stock & Supply Chain)
- Manajemen logistik barang dengan sistem peringatan stok kritis (*minimum stock alert*) otomatis.
- Filter klasifikasi kategori, penambahan item inventaris, dan pencarian instan.

### 7. 💵 Manajemen Keuangan (Finance Ledger)
- Dashboard arus kas dinamis dengan perhitungan agregat pengeluaran, pemasukan, profit bersih, serta rasio profit margin.
- Pencatatan transaksi chronological lengkap dengan pencarian, ekspor data, dan kategorisasi operasional.

### 8. 📈 Analitik & Audit (Data Logging)
- Pipeline visualisasi data analitik komprehensif, sebaran performa triwulanan, dan transparansi jejak audit akses.

### 9. 🤖 AI Co-Pilot Assistant (Bertenaga Gemini API)
- Asisten berbasis AI yang terintegrasi di dalam aplikasi menggunakan server-side proxy aman.
- Dapat diakses kapan saja untuk menanyakan estimasi keuangan, performa stok barang, koordinasi karyawan, maupun perumusan strategi bisnis.

---

## 🛠️ Stack Teknologi

- **Frontend & UI**:
  - [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS v4](https://tailwindcss.com/) (Desain adaptif dan berpresisi tinggi)
  - [Lucide React](https://lucide.dev/) (Set ikon vector yang bersih dan seragam)
  - [Recharts](https://recharts.org/) (Grafik dan infografis interaktif)
  - [Motion](https://motion.dev/) (Transisi mikro-interaksi yang halus)
  
- **Backend & API**:
  - [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/) (Server-side API routes & static file server)
  - [TSX](https://github.com/privatenumber/tsx) (Hot execution TypeScript untuk development)
  - [Esbuild](https://esbuild.github.io/) (Bundling build produksi backend yang sangat cepat ke format `.cjs` demi kestabilan kontainer)
  - [Google GenAI SDK](https://www.npmjs.com/package/@google/genai) (Integrasi model Gemini secara asinkronus dan aman di sisi server)

---

## ⚙️ Jalur Konfigurasi & Cara Menjalankan

### 1. Prerekuisite & Variabel Lingkungan
Konfigurasikan file `.env` di direktori utama Anda berdasarkan `.env.example`:
```env
# Kunci API Gemini yang aman dan dideklarasikan di sisi server saja
GEMINI_API_KEY=your_gemini_api_key_here
```
### 2. Jalankan Mode Development
Untuk memulai server pengembangan lokal beserta middleware hot-reload Vite:
```bash
npm run dev
```
Aplikasi akan dapat diakses secara default di port `3000` (http://localhost:3000).
### 3. Kompilasi & Build Produksi
Untuk memaketkan aplikasi frontend statis sekaligus mengompilasi backend server ke `dist/server.cjs` yang stabil:
```bash
npm run build
```
### 4. Jalankan Server Produksi
Untuk menjalankan aplikasi di server produksi / cloud native containers:
```bash
npm run start
```
## 📂 Struktur Utama Proyek

```bash
├── server.ts              # Entry-point Backend Node/Express + Integrasi Gemini API
├── vite.config.ts         # Konfigurasi plugin React & Tailwind untuk bundler Vite
├── package.json           # Manajemen dependensi dan script runtime pembangunan sistem
├── metadata.json          # Izin rujukan and status utama kapabilitas sistem
└── src/
    ├── main.tsx           # Titik awal bootstraping bundel frontend React
    ├── App.tsx            # Komponen Induk, state orchestrator, dan fetcher data utama
    ├── index.css          # Setup global styling Tailwind CSS & font custom
    └── components/        # Modul sub-view untuk membagi fungsionalitas core ERP:
        ├── Sidebar.tsx    # Panel navigasi collapsible interaktif
        ├── Header.tsx     # Bilah atas, pencarian global, jam live, dan notifikasi
        ├── DashboardView.tsx # Dashboard ringkasan (Overview KPIs & visual chart)
        ├── EmployeesView.tsx # Panel Manajemen HR Karyawan termutakhir
        ├── FinanceView.tsx   # Pembukuan Keuangan dan buku kas
        ├── AiCopilot.tsx  # Drawer interaktif asisten cerdas AI Co-Pilot
        └── ...            # Modul spesifik fitur ERP lainnya
```
