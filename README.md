# Fraction Battle

Game edukasi **pecahan** untuk siswa kelas 5 SD. Dua pemain (atau lawan komputer) bergiliran menjawab soal pecahan; jawaban benar = serangan, jawaban salah = self-damage.

**Tagline:** Kuasai Pecahan, Menangkan Pertarungan!

Semua pecahan ditampilkan dengan penulisan standar sekolah Indonesia, yaitu bersusun (pembilang di atas garis, penyebut di bawah garis), bukan dengan garis miring.

Seluruh karakter, aset, dan desain bersifat **original** — tidak menyalin franchise fighting game berhak cipta.

## Teknologi

- React Native + Expo (SDK 57)
- TypeScript (strict)
- React Navigation
- Zustand
- AsyncStorage
- Expo Audio + Expo Haptics (SFX)
- React Native Reanimated
- Expo Linear Gradient

## Instalasi & Menjalankan

```bash
npm install
npx expo start
```

Perintah berguna:

```bash
npm run typecheck
npm run android
npm run generate:questions   # bangun ulang bank soal
npm run generate:brand       # bangun ulang logo PNG & icon dari assets/logo-game.jpg
```

Build APK Android (EAS):

```bash
npx eas-cli build -p android --profile preview
```

## Gameplay

1. Pilih mode: **Player vs Player** atau **Player vs Computer**
2. Pilih salah satu dari 4 level pecahan (semua terbuka), baca materinya dulu
3. Kustomisasi karakter dan nama pemain
4. Mulai battle turn-based
5. Jawab soal, lalu damage atau self-damage, lalu ganti giliran
6. Habiskan HP lawan untuk menang

### Level

| Level | Materi | Waktu per soal |
|-------|--------|----------------|
| 1 | Penjumlahan & pengurangan penyebut sama | 60 detik |
| 2 | Penjumlahan & pengurangan penyebut berbeda (KPK) | 60 detik |
| 3 | Pecahan campuran | 60 detik |
| 4 | Soal cerita numerasi | 120 detik |

### HP & Damage

| Kesulitan | Damage |
|-----------|--------|
| Easy | 10 |
| Normal | 20 |
| Hard | 30 |

Self-damage salah/timeout: **10** (dikurangi defense karakter).

### Skor & Combo

- Easy +100 · Normal +200 · Hard +300
- Bonus cepat: &lt;3s +50 · &lt;5s +25
- Salah: −50
- Combo x2–x4 mengalikan skor jawaban benar

### NPC (PvC)

| Level | Akurasi | Delay |
|-------|---------|-------|
| Easy | 60% | 3–5 detik |
| Normal | 75% | 2–4 detik |
| Hard | 90% | 1–3 detik |

## Struktur Folder

```
src/
├── assets/
├── components/
├── screens/
├── navigation/
├── data/          # questions, characters, levels, achievements
├── store/         # gameStore, playerStore, settingsStore
├── services/      # AudioManager, StorageService, QuestionService
├── utils/
├── types/
├── constants/
└── theme/
```

## Menambah Soal

`src/data/questions.ts` dibuat otomatis (25 soal per level). Jangan edit langsung:

1. Tambah soal tulisan tangan di `scripts/fraction-question-seeds.json`. Baris terakhir `question` wajib berisi persamaan, misalnya `3/4 - 1/4 = ?`; soal cerita ditulis di baris sebelumnya.
2. Jalankan `npm run generate:questions`. Script menghitung ulang jawaban ke bentuk paling sederhana, membuat 4 pilihan dengan nilai berbeda, lalu melengkapi tiap level dengan generator.
3. Script gagal jika ada jawaban seed yang salah atau soal yang tidak valid.

Di data, pecahan ditulis `3/4` dan pecahan campuran `2 1/3`. Komponen `FractionText` dan `FractionDisplay` (`src/components/Fraction/FractionView.tsx`) merendernya bersusun di layar. Generator dinamis ada di `src/utils/questionGenerator.ts`, aritmetika pecahan di `src/utils/fraction.ts`.

## Menambah Karakter

Edit `src/data/characters.ts`:

```ts
{
  id: 'nova',
  name: 'Nova',
  title: '...',
  description: '...',
  color: '#...',
  accentColor: '#...',
  emoji: '🌟', // ganti ke image asset nanti
  stats: { hp: 100, attack: 20, defense: 15, speed: 15 },
}
```

Komponen `CharacterView` sudah siap diganti sprite tanpa mengubah battle engine.

## Menambah Level

Tambahkan level di `src/data/levels.ts`, materinya di `src/data/materials.ts`, kategori baru di `QuestionCategory` (`src/types/game.ts`) beserta generatornya di `questionGenerator.ts`, lalu jalankan `npm run generate:questions`.

## Offline Storage

`StorageService` menyimpan:

- profil & progress
- best score / stars per level
- achievement
- settings (music, SFX, vibration, language)

Tanpa backend, Firebase, atau API online.

## Audio

File di `assets/audio/`:

| File | Penggunaan |
|------|------------|
| `bgm_main_menu.mp3` | BGM Main Menu |
| `bgm_fight.mp3` | BGM Battle |
| `sfx_click_menu.mp3` | Klik / salah / defeat |
| `sfx_punch.mp3` | Benar / serangan / hit / victory |

Dikelola lewat `AudioManager` (`expo-audio`).

## Lisensi

0BSD — project edukasi lokal.
