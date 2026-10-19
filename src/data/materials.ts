export interface MaterialExample {
  title: string;
  problem: string;
  steps: string[];
  answer: string;
}

export interface FractionMaterial {
  levelId: number;
  title: string;
  subtitle: string;
  youtubeId: string;
  youtubeUrl: string;
  conceptSummary: string;
  rules: string[];
  examples: MaterialExample[];
  verticalMethodExplanation: string;
  battleTips: string;
}

export const FRACTION_MATERIALS: Record<number, FractionMaterial> = {
  1: {
    levelId: 1,
    title: 'Penjumlahan & Pengurangan Penyebut Sama',
    subtitle: 'Konsep Dasar: Cukup Operasikan Pembilang!',
    youtubeId: 'zjMODzLoiTo',
    youtubeUrl: 'https://www.youtube.com/watch?v=zjMODzLoiTo',
    conceptSummary:
      'Pecahan terdiri dari Pembilang (angka di atas) dan Penyebut (angka di bawah). Jika dua pecahan memiliki angka penyebut yang SAMA, maka penyebutnya TIDAK BOLEH dijumlahkan atau dikurangkan, melainkan tetap sama. Kita hanya menjumlahkan atau mengurangkan angka pembilang di bagian atas!',
    rules: [
      'Penyebut (bawah) TETAP SAMA, tidak berubah.',
      'Hanya pembilang (atas) yang dijumlahkan atau dikurangkan.',
      'Jika hasil pembilang dan penyebut bisa disederhanakan, bagi dengan angka FPB yang sama.',
    ],
    verticalMethodExplanation:
      'Tuliskan pecahan secara tegak (pembilang di atas dan penyebut di bawah). Pada pecahan dengan penyebut yang sama, operasikan angka pembilang secara langsung dan biarkan angka penyebutnya tetap sama.',
    examples: [
      {
        title: 'Penjumlahan Pecahan Berpenyebut Sama',
        problem: '1/4 + 2/4 = ?',
        steps: [
          'Kedua pecahan memiliki penyebut yang sama (4).',
          'Jumlahkan angka pembilang: 1 + 2 = 3.',
          'Penyebut tetap sama, yaitu 4.',
          'Hasil akhir: 3/4.',
        ],
        answer: '3/4',
      },
      {
        title: 'Pengurangan Pecahan Berpenyebut Sama',
        problem: '5/7 - 2/7 = ?',
        steps: [
          'Kedua pecahan memiliki penyebut yang sama (7).',
          'Kurangkan angka pembilang: 5 - 2 = 3.',
          'Penyebut tetap sama, yaitu 7.',
          'Hasil akhir: 3/7.',
        ],
        answer: '3/7',
      },
    ],
    battleTips: 'Jangan terjebak menjumlahkan angka bawah! Jika 1/5 + 2/5 jawabannya adalah 3/5, bukan 3/10.',
  },
  2: {
    levelId: 2,
    title: 'Penjumlahan & Pengurangan Penyebut Berbeda',
    subtitle: 'Kunci Sukses: Samakan Penyebut Menggunakan KPK!',
    youtubeId: 'ldigTTXPZ2k',
    youtubeUrl: 'https://www.youtube.com/watch?v=ldigTTXPZ2k',
    conceptSummary:
      'Jika angka penyebut (bawah) BERBEDA, kita TIDAK BISA langsung menjumlahkan atau mengurangkannya! Kita wajib menyamakan penyebut terlebih dahulu menggunakan KPK (Kelipatan Persekutuan Terkecil) atau metode perkalian silang kupu-kupu.',
    rules: [
      'Cari KPK dari kedua penyebut untuk dijadikan penyebut baru.',
      'Ubah pembilang: (Penyebut baru ÷ Penyebut lama) × Pembilang lama.',
      'Setelah penyebut sama, operasikan pembilang seperti biasa.',
    ],
    verticalMethodExplanation:
      'Samakan penyebut kedua pecahan dengan mencari KPK terlebih dahulu. Setelah penyebut sama, ubah masing-masing pembilang lalu lakukan operasi penjumlahan atau pengurangan.',
    examples: [
      {
        title: 'Penjumlahan Beda Penyebut',
        problem: '1/2 + 1/4 = ?',
        steps: [
          'KPK dari 2 dan 4 adalah 4.',
          'Ubah 1/2 menjadi 2/4 (karena 4 ÷ 2 × 1 = 2).',
          'Pecahan kedua tetap 1/4.',
          'Hitung: 2/4 + 1/4 = 3/4.',
        ],
        answer: '3/4',
      },
      {
        title: 'Pengurangan Beda Penyebut',
        problem: '2/3 - 1/2 = ?',
        steps: [
          'KPK dari 3 dan 2 adalah 6.',
          '2/3 diubah menjadi 4/6.',
          '1/2 diubah menjadi 3/6.',
          'Hitung: 4/6 - 3/6 = 1/6.',
        ],
        answer: '1/6',
      },
    ],
    battleTips: 'Metode Cepat Silang: (a/b) + (c/d) = (a×d + b×c) / (b×d). Contoh: 1/3 + 1/4 = (4 + 3)/12 = 7/12!',
  },
  3: {
    levelId: 3,
    title: 'Penjumlahan & Pengurangan Pecahan Campuran',
    subtitle: 'Gabungan Bilangan Bulat dan Pecahan Biasa',
    youtubeId: 'wSgnYV6ucsg',
    youtubeUrl: 'https://www.youtube.com/watch?v=wSgnYV6ucsg',
    conceptSummary:
      'Pecahan campuran memiliki bilangan bulat di depan dan pecahan biasa di belakang, misalnya 2 1/3. Ada 2 cara menyelesaikan: (1) Mengubah ke pecahan biasa terlebih dahulu, atau (2) Memisahkan bilangan bulat dan pecahannya.',
    rules: [
      'Cara 1 (Ubah ke Pecahan Biasa): a b/c = (a × c + b) / c.',
      'Cara 2 (Pemisahan): Kelompokkan bilangan bulat (A ± B) dan pecahannya (a/c ± b/d).',
      'Jika pada pengurangan pembilang tidak cukup, pinjam 1 dari bilangan bulat (1 = c/c).',
    ],
    verticalMethodExplanation:
      'Ubah pecahan campuran menjadi pecahan biasa terlebih dahulu, atau pisahkan penjumlahan/pengurangan bilangan bulat dan pecahannya secara teratur.',
    examples: [
      {
        title: 'Penjumlahan Campuran',
        problem: '1 1/2 + 2 1/4 = ?',
        steps: [
          'Jumlahkan bilangan bulat: 1 + 2 = 3.',
          'Samakan penyebut pecahan: 1/2 = 2/4.',
          'Jumlahkan pecahan: 2/4 + 1/4 = 3/4.',
          'Gabungkan hasil: 3 3/4.',
        ],
        answer: '3 3/4',
      },
      {
        title: 'Pengurangan Campuran',
        problem: '3 1/2 - 1 3/4 = ?',
        steps: [
          'Ubah ke pecahan biasa: 3 1/2 = 7/2 = 14/4, dan 1 3/4 = 7/4.',
          'Kurangkan: 14/4 - 7/4 = 7/4.',
          'Ubah kembali ke pecahan campuran: 7/4 = 1 3/4.',
        ],
        answer: '1 3/4',
      },
    ],
    battleTips: 'Mengubah ke pecahan biasa terlebih dahulu selalu lebih aman dari kesalahan peminjaman angka.',
  },
  4: {
    levelId: 4,
    title: 'Numerasi & Cerita Kontekstual (Storytelling)',
    subtitle: 'Memecahkan Masalah Pecahan di Kehidupan Nyata (Waktu 2 Menit)',
    youtubeId: 'jYbyi5hOFac',
    youtubeUrl: 'https://www.youtube.com/watch?v=jYbyi5hOFac',
    conceptSummary:
      'Soal numerasi menyajikan situasi cerita sehari-hari seperti membagi kue, membeli beras di pasar, membuat resep masakan, atau menghitung sisa pita. Kunci utamanya adalah memahami kata kunci: apakah cerita meminta penjumlahan (membeli lagi, menggabungkan) atau pengurangan (diberikan, sisa, tumpah, terpakai).',
    rules: [
      'Baca cerita secara saksama, tandai angka-angka pecahan yang ada.',
      'Identifikasi kata kunci: "membeli lagi / ditambah" = +, "diberikan / sisa / terpakai" = -.',
      'Tuliskan persamaan matematikanya secara rapi di lembar coretan.',
      'Waktu permainan di level ini adalah 2 menit (120 detik), jangan terburu-buru!',
    ],
    verticalMethodExplanation:
      'Setelah membaca narasi cerita, tuliskan langsung persamaan matematika pecahan yang bersesuaian agar mudah dihitung dan tidak keliru tanda.',
    examples: [
      {
        title: 'Cerita Tepung Kue Ibu',
        problem: 'Ibu memiliki 3/4 kg tepung. Digunakan 1/4 kg untuk membuat roti. Berapa sisa tepung Ibu?',
        steps: [
          'Kata kunci: "digunakan" artinya pengurangan (-).',
          'Model matematika: 3/4 - 1/4.',
          'Penyebut sama: 3 - 1 = 2, sehingga hasilnya 2/4.',
          'Sederhanakan bagi 2: 2/4 = 1/2 kg.',
        ],
        answer: '1/2',
      },
      {
        title: 'Cerita Tali Pramuka',
        problem: 'Budi memiliki tali sepanjang 1 1/2 meter. Ayah membelikan lagi 3/4 meter. Berapa total panjang tali Budi?',
        steps: [
          'Kata kunci: "membelikan lagi" artinya penjumlahan (+).',
          'Model matematika: 1 1/2 + 3/4.',
          'Ubah ke per-4: 1 2/4 + 3/4 = 1 5/4 = 2 1/4 meter.',
        ],
        answer: '2 1/4',
      },
    ],
    battleTips: 'Perhatikan apakah jawaban opsi meminta bentuk paling sederhana (misal 2/4 disederhanakan menjadi 1/2).',
  },
  5: {
    levelId: 5,
    title: 'Perkalian & Pembagian Pecahan',
    subtitle: 'Aturan Emas: Atas Kali Atas, Bawah Kali Bawah!',
    youtubeId: 'cjECTeWM3Zk',
    youtubeUrl: 'https://www.youtube.com/watch?v=cjECTeWM3Zk',
    conceptSummary:
      'Berbeda dengan penjumlahan, pada perkalian pecahan kita TIDAK PERLU menyamakan penyebut! Cukup kalikan pembilang dengan pembilang, dan penyebut dengan penyebut. Untuk pembagian, balik pecahan kedua (tukar pembilang dan penyebut) lalu ubah tanda bagi menjadi kali!',
    rules: [
      'Perkalian: (a/b) × (c/d) = (a × c) / (b × d).',
      'Pembagian: (a/b) ÷ (c/d) = (a/b) × (d/c).',
      'Jika ada pecahan campuran, WAJIB diubah ke pecahan biasa terlebih dahulu.',
    ],
    verticalMethodExplanation:
      'Pada perkalian pecahan, kalikan langsung pembilang dengan pembilang, dan penyebut dengan penyebut. Pada pembagian, balik pecahan kedua lalu ubah tanda bagi menjadi kali.',
    examples: [
      {
        title: 'Perkalian Pecahan',
        problem: '2/3 × 3/4 = ?',
        steps: [
          'Kalikan pembilang: 2 × 3 = 6.',
          'Kalikan penyebut: 3 × 4 = 12.',
          'Sederhanakan 6/12 dengan membagi 6: 1/2.',
        ],
        answer: '1/2',
      },
      {
        title: 'Pembagian Pecahan',
        problem: '1/2 ÷ 1/4 = ?',
        steps: [
          'Balik pecahan kedua: 1/4 menjadi 4/1.',
          'Ubah tanda bagi menjadi kali: 1/2 × 4/1.',
          'Hitung: (1 × 4) / (2 × 1) = 4/2 = 2.',
        ],
        answer: '2',
      },
    ],
    battleTips: 'Mencoret/menyederhanakan angka silang sebelum mengalikan akan menghemat waktu berhitungmu!',
  },
  6: {
    levelId: 6,
    title: 'Operasi Campuran Pecahan (BODMAS)',
    subtitle: 'Urutan Kekuatan Operasi: Kurung, Kali/Bagi, Tambah/Kurang',
    youtubeId: 'qz1l8dm3Fz0',
    youtubeUrl: 'https://www.youtube.com/watch?v=qz1l8dm3Fz0',
    conceptSummary:
      'Operasi campuran memuat kombinasi tambah, kurang, kali, dan bagi. Urutan pengerjaan harus mengikuti aturan prioritas matematika: tanda kurung dikerjakan pertama, disusul perkalian dan pembagian (dari kiri ke kanan), dan terakhir penjumlahan dan pengurangan.',
    rules: [
      'Prioritas 1: Operasi di dalam tanda kurung ( ).',
      'Prioritas 2: Perkalian (×) dan Pembagian (÷) dari kiri ke kanan.',
      'Prioritas 3: Penjumlahan (+) dan Pengurangan (-) dari kiri ke kanan.',
    ],
    verticalMethodExplanation:
      'Selesaikan operasi pecahan sesuai urutan prioritas matematika (BODMAS): kerjakan operasi di dalam kurung lebih dulu, lalu kali atau bagi, dan terakhir tambah atau kurang.',
    examples: [
      {
        title: 'Operasi Campuran (1/2 + 1/4 × 2/3)',
        problem: '1/2 + (1/4 × 2/3) = ?',
        steps: [
          'Dahulukan perkalian: 1/4 × 2/3 = 2/12 = 1/6.',
          'Sekarang hitung penjumlahan: 1/2 + 1/6.',
          'Samakan penyebut ke 6: 3/6 + 1/6 = 4/6.',
          'Sederhanakan bagi 2: 2/3.',
        ],
        answer: '2/3',
      },
    ],
    battleTips: 'Jangan langsung menjumlahkan dari depan jika ada tanda kali di belakangnya!',
  },
  7: {
    levelId: 7,
    title: 'Tantangan Numerasi Tingkat Lanjut',
    subtitle: 'Studi Kasus Nyata: Lahan Kebun, Resep Adonan, & Distribusi (2 Menit)',
    youtubeId: '_wvk1_lXUJ4',
    youtubeUrl: 'https://www.youtube.com/watch?v=_wvk1_lXUJ4',
    conceptSummary:
      'Pada level 7, kamu akan menghadapi soal cerita multi-tahap yang membutuhkan ketelitian tinggi. Setiap soal dirancang dengan skenario menarik seperti pembagian hasil panen, proyek pembuatan bendungan mini, hingga pembagian warisan/hadiah lomba.',
    rules: [
      'Identifikasi nilai awal atau keseluruhan (Total = 1 bagian utuh).',
      'Tuliskan pecahan yang dialokasikan ke masing-masing pihak.',
      'Sisa bagian dihitung dengan: 1 - (bagian A + bagian B).',
      'Waktu berpikir disediakan 2 menit penuh (120 detik).',
    ],
    verticalMethodExplanation:
      'Tuliskan persamaan pecahan secara teratur untuk menjumlahkan semua alokasi sebelum mengurangkannya dari total 1 bagian utuh.',
    examples: [
      {
        title: 'Pembagian Lahan Pak Ahmad',
        problem:
          'Pak Ahmad memiliki sebidang tanah. 1/3 bagian ditanami jagung dan 2/5 bagian ditanami padi. Sisanya dibuat kolam ikan. Berapa bagian tanah untuk kolam ikan?',
        steps: [
          'Total tanah adalah 1 bagian utuh.',
          'Jumlahkan tanaman: 1/3 + 2/5 = (5 + 6)/15 = 11/15 bagian.',
          'Sisa untuk kolam: 1 - 11/15 = 15/15 - 11/15 = 4/15 bagian.',
        ],
        answer: '4/15',
      },
    ],
    battleTips: 'Angka 1 utuh dapat selalu diubah menjadi pecahan dengan pembilang dan penyebut kembar, misalnya 15/15 atau 8/8.',
  },
  8: {
    levelId: 8,
    title: 'Duel Master Pecahan',
    subtitle: 'Arena Juara Puncak: Ujian Segala Jenis Operasi Pecahan',
    youtubeId: 'KkvcjxSXZ2I',
    youtubeUrl: 'https://www.youtube.com/watch?v=KkvcjxSXZ2I',
    conceptSummary:
      'Selamat datang di puncak Fraction Battle! Di level pamungkas ini, kamu akan diuji dengan campuran seluruh tipe pecahan: penyebut sama, penyebut berbeda, pecahan campuran, desimal-pecahan, serta tantangan kecepatan!',
    rules: [
      'Gabungkan semua strategi yang telah kamu pelajari dari Level 1 hingga Level 7.',
      'Fokus pada ketelitian tanda (+, -, ×, ÷).',
      'Pertahankan kombo jawaban benar untuk melipatgandakan skor pertarunganmu!',
    ],
    verticalMethodExplanation:
      'Tuliskan pecahan dalam bentuk tegak dan teratur untuk menjaga ketelitian serta kecepatan berhitungmu saat bertarung.',
    examples: [
      {
        title: 'Tantangan Master',
        problem: '2 1/2 - 3/4 + 1/2 = ?',
        steps: [
          'Ubah ke per-4: 2 2/4 - 3/4 + 2/4.',
          '2 2/4 = 10/4.',
          '10/4 - 3/4 = 7/4.',
          '7/4 + 2/4 = 9/4 = 2 1/4.',
        ],
        answer: '2 1/4',
      },
    ],
    battleTips: 'Kuasai ketenangan pikiran dan jangan terburu-buru. Kemenangan diraih dengan akurasi dan kecepatan!',
  },
};

export function getMaterialByLevel(levelId: number): FractionMaterial {
  return FRACTION_MATERIALS[levelId] ?? FRACTION_MATERIALS[1];
}
