# Math Duel

Game edukasi matematika **offline** untuk siswa kelas 5 SD. Dua pemain (atau lawan komputer) bergiliran menjawab soal; jawaban benar = serangan, jawaban salah = self-damage.

**Tagline:** Think Fast. Fight Smart!

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
npm run generate:questions
```

## Gameplay

1. Pilih mode: **Player vs Player** atau **Player vs Computer**
2. Pilih level matematika (sistem unlock berurutan)
3. Pilih karakter (Kai, Raka, Naya, Zara)
4. Mulai battle turn-based
5. Jawab soal → damage / self-damage → ganti giliran
6. Habiskan HP lawan untuk menang

### HP & Damage

| Kesulitan | Damage | Timer |
|-----------|--------|-------|
| Easy | 10 | 15 detik |
| Normal | 20 | 10 detik |
| Hard | 30 | 8 detik |

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

1. Edit `src/data/questions.ts`, atau
2. Perbarui `scripts/generate-questions.js` lalu jalankan `npm run generate:questions`
3. Pastikan tiap soal punya 4 opsi unik dan `answer` ada di `options`

Generator dinamis ada di `src/utils/questionGenerator.ts`.

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

Edit `src/data/levels.ts` dan pastikan ada soal dengan `level` yang sesuai di `questions.ts`.

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
