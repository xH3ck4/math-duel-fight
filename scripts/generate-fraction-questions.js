const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'src', 'data', 'questions.ts');

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const rawQuestions = [
  // ==========================================
  // LEVEL 1: PENYEBUT SAMA (Penjumlahan & Pengurangan)
  // ==========================================
  {
    level: 1, category: 'fraction_like', difficulty: 'easy',
    question: "1/4 + 2/4 = ?", options: ["3/4", "3/8", "2/4", "1/4"],
    answer: "3/4", explanation: "Karena penyebutnya sama (4), jumlahkan pembilang: 1 + 2 = 3. Hasilnya 3/4.",
    damage: 15, timeLimit: 60,
  },
  {
    level: 1, category: 'fraction_like', difficulty: 'easy',
    question: "5/7 - 2/7 = ?", options: ["3/7", "3/0", "4/7", "2/7"],
    answer: "3/7", explanation: "Penyebutnya sama (7), kurangkan pembilang: 5 - 2 = 3. Hasilnya 3/7.",
    damage: 15, timeLimit: 60,
  },
  {
    level: 1, category: 'fraction_like', difficulty: 'easy',
    question: "2/5 + 1/5 = ?", options: ["3/5", "3/10", "4/5", "1/5"],
    answer: "3/5", explanation: "Penyebut sama (5), hitung pembilang: 2 + 1 = 3. Hasilnya 3/5.",
    damage: 15, timeLimit: 60,
  },
  {
    level: 1, category: 'fraction_like', difficulty: 'easy',
    question: "7/9 - 4/9 = ?", options: ["3/9", "3/0", "2/9", "4/9"],
    answer: "3/9", explanation: "Penyebut sama (9), kurangkan pembilang: 7 - 4 = 3. Hasilnya 3/9.",
    damage: 15, timeLimit: 60,
  },
  {
    level: 1, category: 'fraction_like', difficulty: 'normal',
    question: "3/8 + 4/8 = ?", options: ["7/8", "7/16", "6/8", "5/8"],
    answer: "7/8", explanation: "Penyebut sama (8), jumlahkan pembilang: 3 + 4 = 7. Hasilnya 7/8.",
    damage: 25, timeLimit: 60,
  },
  {
    level: 1, category: 'fraction_like', difficulty: 'normal',
    question: "9/10 - 3/10 = ?", options: ["6/10", "6/0", "5/10", "7/10"],
    answer: "6/10", explanation: "Penyebut sama (10), kurangkan pembilang: 9 - 3 = 6. Hasilnya 6/10.",
    damage: 25, timeLimit: 60,
  },
  {
    level: 1, category: 'fraction_like', difficulty: 'normal',
    question: "5/12 + 6/12 = ?", options: ["11/12", "11/24", "10/12", "9/12"],
    answer: "11/12", explanation: "Penyebut sama (12), jumlahkan pembilang: 5 + 6 = 11. Hasilnya 11/12.",
    damage: 25, timeLimit: 60,
  },
  {
    level: 1, category: 'fraction_like', difficulty: 'normal',
    question: "11/15 - 7/15 = ?", options: ["4/15", "4/0", "5/15", "3/15"],
    answer: "4/15", explanation: "Penyebut sama (15), kurangkan pembilang: 11 - 7 = 4. Hasilnya 4/15.",
    damage: 25, timeLimit: 60,
  },
  {
    level: 1, category: 'fraction_like', difficulty: 'hard',
    question: "7/16 + 5/16 = ?", options: ["12/16", "12/32", "11/16", "13/16"],
    answer: "12/16", explanation: "Penyebut sama (16), 7 + 5 = 12. Hasilnya 12/16.",
    damage: 35, timeLimit: 120,
  },
  {
    level: 1, category: 'fraction_like', difficulty: 'hard',
    question: "17/20 - 9/20 = ?", options: ["8/20", "8/0", "7/20", "9/20"],
    answer: "8/20", explanation: "Penyebut sama (20), 17 - 9 = 8. Hasilnya 8/20.",
    damage: 35, timeLimit: 120,
  },
  {
    level: 1, category: 'fraction_like', difficulty: 'easy',
    question: "3/6 + 2/6 = ?", options: ["5/6", "5/12", "4/6", "1/6"],
    answer: "5/6", explanation: "Penyebut sama (6), jumlahkan pembilang: 3 + 2 = 5. Hasilnya 5/6.",
    damage: 15, timeLimit: 60,
  },
  {
    level: 1, category: 'fraction_like', difficulty: 'normal',
    question: "8/11 - 3/11 = ?", options: ["5/11", "5/0", "6/11", "4/11"],
    answer: "5/11", explanation: "Penyebut sama (11), kurangkan pembilang: 8 - 3 = 5. Hasilnya 5/11.",
    damage: 25, timeLimit: 60,
  },

  // ==========================================
  // LEVEL 2: PENYEBUT BERBEDA (KPK & Samakan Penyebut)
  // ==========================================
  {
    level: 2, category: 'fraction_unlike', difficulty: 'easy',
    question: "1/2 + 1/4 = ?", options: ["3/4", "2/6", "2/4", "1/4"],
    answer: "3/4", explanation: "KPK dari 2 dan 4 adalah 4. 1/2 = 2/4. Maka 2/4 + 1/4 = 3/4.",
    damage: 15, timeLimit: 60,
  },
  {
    level: 2, category: 'fraction_unlike', difficulty: 'easy',
    question: "3/4 - 1/2 = ?", options: ["1/4", "2/2", "2/4", "1/2"],
    answer: "1/4", explanation: "KPK 4 dan 2 adalah 4. 1/2 = 2/4. Maka 3/4 - 2/4 = 1/4.",
    damage: 15, timeLimit: 60,
  },
  {
    level: 2, category: 'fraction_unlike', difficulty: 'easy',
    question: "1/3 + 1/6 = ?", options: ["3/6", "2/9", "2/6", "4/6"],
    answer: "3/6", explanation: "KPK 3 dan 6 adalah 6. 1/3 = 2/6. Maka 2/6 + 1/6 = 3/6.",
    damage: 15, timeLimit: 60,
  },
  {
    level: 2, category: 'fraction_unlike', difficulty: 'normal',
    question: "2/3 - 1/2 = ?", options: ["1/6", "1/1", "2/6", "3/6"],
    answer: "1/6", explanation: "KPK 3 dan 2 adalah 6. 2/3 = 4/6, dan 1/2 = 3/6. Maka 4/6 - 3/6 = 1/6.",
    damage: 25, timeLimit: 60,
  },
  {
    level: 2, category: 'fraction_unlike', difficulty: 'normal',
    question: "1/3 + 2/5 = ?", options: ["11/15", "3/8", "10/15", "9/15"],
    answer: "11/15", explanation: "KPK 3 dan 5 adalah 15. 1/3 = 5/15, dan 2/5 = 6/15. Maka 5/15 + 6/15 = 11/15.",
    damage: 25, timeLimit: 60,
  },
  {
    level: 2, category: 'fraction_unlike', difficulty: 'normal',
    question: "4/5 - 1/2 = ?", options: ["3/10", "3/3", "4/10", "2/10"],
    answer: "3/10", explanation: "KPK 5 dan 2 adalah 10. 4/5 = 8/10, dan 1/2 = 5/10. Maka 8/10 - 5/10 = 3/10.",
    damage: 25, timeLimit: 60,
  },
  {
    level: 2, category: 'fraction_unlike', difficulty: 'normal',
    question: "3/8 + 1/4 = ?", options: ["5/8", "4/12", "4/8", "6/8"],
    answer: "5/8", explanation: "KPK 8 dan 4 adalah 8. 1/4 = 2/8. Maka 3/8 + 2/8 = 5/8.",
    damage: 25, timeLimit: 60,
  },
  {
    level: 2, category: 'fraction_unlike', difficulty: 'hard',
    question: "5/6 - 2/3 = ?", options: ["1/6", "3/3", "2/6", "3/6"],
    answer: "1/6", explanation: "KPK 6 dan 3 adalah 6. 2/3 = 4/6. Maka 5/6 - 4/6 = 1/6.",
    damage: 35, timeLimit: 120,
  },
  {
    level: 2, category: 'fraction_unlike', difficulty: 'hard',
    question: "3/4 - 2/5 = ?", options: ["7/20", "1/1", "8/20", "6/20"],
    answer: "7/20", explanation: "KPK 4 dan 5 adalah 20. 3/4 = 15/20, dan 2/5 = 8/20. Maka 15/20 - 8/20 = 7/20.",
    damage: 35, timeLimit: 120,
  },
  {
    level: 2, category: 'fraction_unlike', difficulty: 'hard',
    question: "5/12 + 1/3 = ?", options: ["9/12", "6/15", "8/12", "7/12"],
    answer: "9/12", explanation: "KPK 12 dan 3 adalah 12. 1/3 = 4/12. Maka 5/12 + 4/12 = 9/12.",
    damage: 35, timeLimit: 120,
  },
  {
    level: 2, category: 'fraction_unlike', difficulty: 'normal',
    question: "1/4 + 2/3 = ?", options: ["11/12", "3/7", "10/12", "9/12"],
    answer: "11/12", explanation: "KPK 4 dan 3 adalah 12. 1/4 = 3/12, dan 2/3 = 8/12. 3/12 + 8/12 = 11/12.",
    damage: 25, timeLimit: 60,
  },
  {
    level: 2, category: 'fraction_unlike', difficulty: 'hard',
    question: "7/10 - 2/5 = ?", options: ["3/10", "5/5", "2/10", "4/10"],
    answer: "3/10", explanation: "KPK 10 dan 5 adalah 10. 2/5 = 4/10. Maka 7/10 - 4/10 = 3/10.",
    damage: 35, timeLimit: 120,
  },

  // ==========================================
  // LEVEL 3: PECAHAN CAMPURAN
  // ==========================================
  {
    level: 3, category: 'fraction_mixed', difficulty: 'easy',
    question: "1 1/4 + 2 2/4 = ?", options: ["3 3/4", "3 3/8", "4 1/4", "3 2/4"],
    answer: "3 3/4", explanation: "Jumlahkan bilangan bulat: 1 + 2 = 3. Jumlahkan pecahan: 1/4 + 2/4 = 3/4. Hasil: 3 3/4.",
    damage: 15, timeLimit: 60,
  },
  {
    level: 3, category: 'fraction_mixed', difficulty: 'easy',
    question: "3 4/5 - 1 2/5 = ?", options: ["2 2/5", "2 2/0", "2 1/5", "3 2/5"],
    answer: "2 2/5", explanation: "Kurangkan bilangan bulat: 3 - 1 = 2. Kurangkan pecahan: 4/5 - 2/5 = 2/5. Hasil: 2 2/5.",
    damage: 15, timeLimit: 60,
  },
  {
    level: 3, category: 'fraction_mixed', difficulty: 'normal',
    question: "1 1/2 + 2 1/4 = ?", options: ["3 3/4", "3 2/6", "4 1/4", "3 1/4"],
    answer: "3 3/4", explanation: "1 + 2 = 3. Samakan pecahan: 1/2 = 2/4. 2/4 + 1/4 = 3/4. Hasil: 3 3/4.",
    damage: 25, timeLimit: 60,
  },
  {
    level: 3, category: 'fraction_mixed', difficulty: 'normal',
    question: "4 3/4 - 2 1/2 = ?", options: ["2 1/4", "2 2/2", "2 3/4", "1 1/4"],
    answer: "2 1/4", explanation: "4 - 2 = 2. Samakan pecahan: 1/2 = 2/4. 3/4 - 2/4 = 1/4. Hasil: 2 1/4.",
    damage: 25, timeLimit: 60,
  },
  {
    level: 3, category: 'fraction_mixed', difficulty: 'normal',
    question: "2 1/3 + 1 1/2 = ?", options: ["3 5/6", "3 2/5", "4 1/6", "3 1/6"],
    answer: "3 5/6", explanation: "2 + 1 = 3. 1/3 = 2/6, dan 1/2 = 3/6. 2/6 + 3/6 = 5/6. Hasil: 3 5/6.",
    damage: 25, timeLimit: 60,
  },
  {
    level: 3, category: 'fraction_mixed', difficulty: 'hard',
    question: "3 1/2 - 1 3/4 = ?", options: ["1 3/4", "2 2/2", "1 1/4", "2 1/4"],
    answer: "1 3/4", explanation: "Ubah ke pecahan biasa: 7/2 = 14/4. 1 3/4 = 7/4. 14/4 - 7/4 = 7/4 = 1 3/4.",
    damage: 35, timeLimit: 120,
  },
  {
    level: 3, category: 'fraction_mixed', difficulty: 'hard',
    question: "2 3/8 + 1 1/4 = ?", options: ["3 5/8", "3 4/12", "4 1/8", "3 3/8"],
    answer: "3 5/8", explanation: "2 + 1 = 3. 1/4 = 2/8. 3/8 + 2/8 = 5/8. Hasil: 3 5/8.",
    damage: 35, timeLimit: 120,
  },
  {
    level: 3, category: 'fraction_mixed', difficulty: 'hard',
    question: "5 1/3 - 2 2/3 = ?", options: ["2 2/3", "3 1/3", "2 1/3", "3 2/3"],
    answer: "2 2/3", explanation: "Pinjam 1 dari 5: 5 1/3 = 4 4/3. 4 4/3 - 2 2/3 = 2 2/3.",
    damage: 35, timeLimit: 120,
  },
  {
    level: 3, category: 'fraction_mixed', difficulty: 'normal',
    question: "2 2/5 + 1 1/2 = ?", options: ["3 9/10", "3 3/7", "4 1/10", "3 7/10"],
    answer: "3 9/10", explanation: "2 + 1 = 3. 2/5 = 4/10, dan 1/2 = 5/10. 4/10 + 5/10 = 9/10. Hasil: 3 9/10.",
    damage: 25, timeLimit: 60,
  },
  {
    level: 3, category: 'fraction_mixed', difficulty: 'hard',
    question: "4 1/2 - 1 5/6 = ?", options: ["2 2/3", "3 1/3", "2 1/6", "3 4/6"],
    answer: "2 2/3", explanation: "4 1/2 = 4 3/6 = 3 9/6. 3 9/6 - 1 5/6 = 2 4/6 = 2 2/3.",
    damage: 35, timeLimit: 120,
  },

  // ==========================================
  // LEVEL 4: SOAL NUMERASI (STORYTELLING) — WAKTU 120 DETIK!
  // ==========================================
  {
    level: 4, category: 'fraction_story', difficulty: 'easy',
    question: "Ibu membeli 3/4 kg tepung terigu di warung. Sebanyak 1/4 kg digunakan untuk membuat bolu kukus. Berapa kg sisa tepung terigu Ibu sekarang?\n3/4 - 1/4 = ?",
    options: ["2/4", "1/4", "3/8", "4/4"],
    answer: "2/4", explanation: "Operasi pengurangan: 3/4 - 1/4 = 2/4 kg (atau 1/2 kg).",
    damage: 20, timeLimit: 120,
  },
  {
    level: 4, category: 'fraction_story', difficulty: 'easy',
    question: "Budi memiliki tali sepanjang 1/2 meter. Ayah membelikan lagi 1/4 meter tali pramuka. Berapa meter total panjang tali yang dimiliki Budi?\n1/2 + 1/4 = ?",
    options: ["3/4", "2/6", "1/4", "1/2"],
    answer: "3/4", explanation: "Operasi penjumlahan: 1/2 + 1/4 = 2/4 + 1/4 = 3/4 meter.",
    damage: 20, timeLimit: 120,
  },
  {
    level: 4, category: 'fraction_story', difficulty: 'normal',
    question: "Siti memiliki 1 1/2 liter susu segar di lemari pendingin. Kakak meminum 3/4 liter susu tersebut saat sarapan. Berapa liter sisa susu Siti?\n1 1/2 - 3/4 = ?",
    options: ["3/4", "1/2", "1/4", "1 1/4"],
    answer: "3/4", explanation: "1 1/2 = 6/4. 6/4 - 3/4 = 3/4 liter susu yang tersisa.",
    damage: 30, timeLimit: 120,
  },
  {
    level: 4, category: 'fraction_story', difficulty: 'normal',
    question: "Pak Budi memanen 2 1/4 kuintal jagung manis di ladang timur dan 1 1/2 kuintal di ladang barat. Berapa kuintal total hasil panen jagung Pak Budi?\n2 1/4 + 1 1/2 = ?",
    options: ["3 3/4", "3 2/6", "4 1/4", "3 1/4"],
    answer: "3 3/4", explanation: "2 1/4 + 1 2/4 = 3 3/4 kuintal hasil panen.",
    damage: 30, timeLimit: 120,
  },
  {
    level: 4, category: 'fraction_story', difficulty: 'normal',
    question: "Sebuah botol sirop berisi 4/5 liter. Rani menuangkan 1/2 liter sirop untuk membuat minuman tamu. Berapa liter sisa sirop di botol?\n4/5 - 1/2 = ?",
    options: ["3/10", "3/3", "4/10", "2/10"],
    answer: "3/10", explanation: "Samakan penyebut ke 10: 8/10 - 5/10 = 3/10 liter sirop.",
    damage: 30, timeLimit: 120,
  },
  {
    level: 4, category: 'fraction_story', difficulty: 'hard',
    question: "Dina memotong pita hias sepanjang 3 1/2 meter. Pita itu digunakan untuk membungkus kado sebesar 1 3/4 meter. Berapa meter sisa pita Dina?\n3 1/2 - 1 3/4 = ?",
    options: ["1 3/4", "2 1/4", "1 1/4", "2 3/4"],
    answer: "1 3/4", explanation: "3 1/2 = 3 2/4 = 14/4. 14/4 - 7/4 = 7/4 = 1 3/4 meter.",
    damage: 35, timeLimit: 120,
  },
  {
    level: 4, category: 'fraction_story', difficulty: 'hard',
    question: "Keluarga Pak RT menggunakan 5 1/2 kg beras pada minggu pertama. Pada minggu kedua, mereka memakai 3 1/4 kg beras. Berapa kg selisih penggunaan beras kedua minggu tersebut?\n5 1/2 - 3 1/4 = ?",
    options: ["2 1/4", "2 1/2", "1 3/4", "2 3/4"],
    answer: "2 1/4", explanation: "Selisih: 5 2/4 - 3 1/4 = 2 1/4 kg beras.",
    damage: 35, timeLimit: 120,
  },
  {
    level: 4, category: 'fraction_story', difficulty: 'hard',
    question: "Sebuah akuarium terisi 7/8 bagian air. Karena bocor halus, air berkurang sebanyak 3/8 bagian. Berapa bagian air yang tersisa di akuarium?\n7/8 - 3/8 = ?",
    options: ["4/8", "4/0", "5/8", "3/8"],
    answer: "4/8", explanation: "7/8 - 3/8 = 4/8 bagian (atau 1/2 bagian).",
    damage: 35, timeLimit: 120,
  },
  {
    level: 4, category: 'fraction_story', difficulty: 'hard',
    question: "Doni berlari mengelilingi lintasan 1 3/4 putaran di pagi hari dan 2 1/2 putaran di sore hari. Berapa total putaran yang telah diselesaikan Doni?\n1 3/4 + 2 1/2 = ?",
    options: ["4 1/4", "3 4/6", "3 3/4", "4 3/4"],
    answer: "4 1/4", explanation: "1 3/4 + 2 2/4 = 3 5/4 = 4 1/4 putaran.",
    damage: 35, timeLimit: 120,
  },
  {
    level: 4, category: 'fraction_story', difficulty: 'hard',
    question: "Di dapur terdapat 2 2/3 kg gula pasir. Ibu membeli lagi 1 1/2 kg gula pasir dari pasar swalayan. Berapa kg seluruh persediaan gula pasir Ibu?\n2 2/3 + 1 1/2 = ?",
    options: ["4 1/6", "3 3/5", "3 5/6", "4 2/6"],
    answer: "4 1/6", explanation: "2 4/6 + 1 3/6 = 3 7/6 = 4 1/6 kg gula pasir.",
    damage: 35, timeLimit: 120,
  },

  // ==========================================
  // LEVEL 5: PERKALIAN & PEMBAGIAN PECAHAN
  // ==========================================
  {
    level: 5, category: 'fraction_mult_div', difficulty: 'easy',
    question: "1/2 × 2/3 = ?", options: ["2/6", "3/5", "2/5", "1/6"],
    answer: "2/6", explanation: "Kalikan atas dengan atas, bawah dengan bawah: (1 × 2) / (2 × 3) = 2/6.",
    damage: 15, timeLimit: 60,
  },
  {
    level: 5, category: 'fraction_mult_div', difficulty: 'easy',
    question: "3/4 × 1/2 = ?", options: ["3/8", "4/6", "3/6", "2/8"],
    answer: "3/8", explanation: "(3 × 1) / (4 × 2) = 3/8.",
    damage: 15, timeLimit: 60,
  },
  {
    level: 5, category: 'fraction_mult_div', difficulty: 'easy',
    question: "1/2 ÷ 1/4 = ?", options: ["2", "1/8", "4", "1/2"],
    answer: "2", explanation: "Balik pecahan kedua: 1/2 × 4/1 = 4/2 = 2.",
    damage: 15, timeLimit: 60,
  },
  {
    level: 5, category: 'fraction_mult_div', difficulty: 'normal',
    question: "2/3 ÷ 1/3 = ?", options: ["2", "1/9", "3", "2/9"],
    answer: "2", explanation: "Balik pecahan kedua: 2/3 × 3/1 = 6/3 = 2.",
    damage: 25, timeLimit: 60,
  },
  {
    level: 5, category: 'fraction_mult_div', difficulty: 'normal',
    question: "3/5 × 5/6 = ?", options: ["15/30", "8/11", "15/11", "8/30"],
    answer: "15/30", explanation: "(3 × 5) / (5 × 6) = 15/30 (atau 1/2).",
    damage: 25, timeLimit: 60,
  },
  {
    level: 5, category: 'fraction_mult_div', difficulty: 'normal',
    question: "3/4 ÷ 1/2 = ?", options: ["6/4", "3/8", "1", "2/4"],
    answer: "6/4", explanation: "3/4 × 2/1 = 6/4 (atau 1 1/2).",
    damage: 25, timeLimit: 60,
  },
  {
    level: 5, category: 'fraction_mult_div', difficulty: 'hard',
    question: "1 1/2 × 2/3 = ?", options: ["1", "3/5", "2/5", "1 1/3"],
    answer: "1", explanation: "1 1/2 = 3/2. 3/2 × 2/3 = 6/6 = 1.",
    damage: 35, timeLimit: 120,
  },
  {
    level: 5, category: 'fraction_mult_div', difficulty: 'hard',
    question: "2 1/4 ÷ 3/4 = ?", options: ["3", "1 1/2", "2", "4"],
    answer: "3", explanation: "2 1/4 = 9/4. 9/4 × 4/3 = 36/12 = 3.",
    damage: 35, timeLimit: 120,
  },
  {
    level: 5, category: 'fraction_mult_div', difficulty: 'normal',
    question: "4/7 × 7/8 = ?", options: ["28/56", "11/15", "4/8", "28/15"],
    answer: "28/56", explanation: "(4 × 7) / (7 × 8) = 28/56 (atau 1/2).",
    damage: 25, timeLimit: 60,
  },
  {
    level: 5, category: 'fraction_mult_div', difficulty: 'hard',
    question: "5/8 ÷ 1/4 = ?", options: ["20/8", "5/32", "2", "15/8"],
    answer: "20/8", explanation: "5/8 × 4/1 = 20/8 (atau 2 1/2).",
    damage: 35, timeLimit: 120,
  },

  // ==========================================
  // LEVEL 6: OPERASI CAMPURAN PECAHAN (BODMAS)
  // ==========================================
  {
    level: 6, category: 'fraction_complex', difficulty: 'easy',
    question: "1/4 + 1/4 × 2 = ?", options: ["3/4", "1", "2/4", "1/2"],
    answer: "3/4", explanation: "Dahulukan perkalian: 1/4 × 2 = 2/4. Lalu 1/4 + 2/4 = 3/4.",
    damage: 20, timeLimit: 60,
  },
  {
    level: 6, category: 'fraction_complex', difficulty: 'normal',
    question: "1/2 + 1/4 × 2/3 = ?", options: ["4/6", "3/6", "2/3", "5/6"],
    answer: "4/6", explanation: "1/4 × 2/3 = 2/12 = 1/6. 1/2 = 3/6. 3/6 + 1/6 = 4/6 (atau 2/3).",
    damage: 25, timeLimit: 60,
  },
  {
    level: 6, category: 'fraction_complex', difficulty: 'normal',
    question: "3/4 - 1/2 × 1/2 = ?", options: ["2/4", "1/4", "3/4", "1/2"],
    answer: "2/4", explanation: "1/2 × 1/2 = 1/4. 3/4 - 1/4 = 2/4 (atau 1/2).",
    damage: 25, timeLimit: 60,
  },
  {
    level: 6, category: 'fraction_complex', difficulty: 'normal',
    question: "2/3 × 3/4 + 1/2 = ?", options: ["1", "5/6", "2/3", "1 1/2"],
    answer: "1", explanation: "2/3 × 3/4 = 6/12 = 1/2. 1/2 + 1/2 = 1.",
    damage: 25, timeLimit: 60,
  },
  {
    level: 6, category: 'fraction_complex', difficulty: 'hard',
    question: "1 1/2 + 2/3 × 3/4 = ?", options: ["2", "1 5/6", "2 1/4", "1 1/2"],
    answer: "2", explanation: "2/3 × 3/4 = 6/12 = 1/2. 1 1/2 + 1/2 = 2.",
    damage: 35, timeLimit: 120,
  },
  {
    level: 6, category: 'fraction_complex', difficulty: 'hard',
    question: "5/6 - 1/3 ÷ 2/3 = ?", options: ["2/6", "1/6", "3/6", "4/6"],
    answer: "2/6", explanation: "1/3 ÷ 2/3 = 1/3 × 3/2 = 3/6 = 1/2 = 3/6. 5/6 - 3/6 = 2/6 (atau 1/3).",
    damage: 35, timeLimit: 120,
  },
  {
    level: 6, category: 'fraction_complex', difficulty: 'hard',
    question: "2 1/4 - 1/2 × 2 = ?", options: ["1 1/4", "2", "1 1/2", "1 3/4"],
    answer: "1 1/4", explanation: "1/2 × 2 = 1. 2 1/4 - 1 = 1 1/4.",
    damage: 35, timeLimit: 120,
  },
  {
    level: 6, category: 'fraction_complex', difficulty: 'hard',
    question: "3/5 + 1/5 × 2 = ?", options: ["1", "4/5", "3/5", "1 1/5"],
    answer: "1", explanation: "1/5 × 2 = 2/5. 3/5 + 2/5 = 5/5 = 1.",
    damage: 35, timeLimit: 120,
  },

  // ==========================================
  // LEVEL 7: TANTANGAN NUMERASI LANJUT — WAKTU 120 DETIK!
  // ==========================================
  {
    level: 7, category: 'fraction_story_advanced', difficulty: 'easy',
    question: "Pak Ahmad memiliki sebidang tanah utuh (1 bagian). Sebanyak 1/3 bagian ditanami jagung dan 2/5 bagian ditanami padi. Sisanya dibuat kolam ikan. Berapa bagian tanah untuk kolam ikan?\n1 - 11/15 = ?",
    options: ["4/15", "3/15", "5/15", "2/15"],
    answer: "4/15", explanation: "1/3 + 2/5 = 5/15 + 6/15 = 11/15. Kolam ikan: 15/15 - 11/15 = 4/15 bagian.",
    damage: 25, timeLimit: 120,
  },
  {
    level: 7, category: 'fraction_story_advanced', difficulty: 'normal',
    question: "Di perpustakaan sekolah, 1/2 buku adalah novel fiksi dan 1/4 buku adalah komik edukasi. Sisanya buku ensiklopedia. Berapa bagian buku ensiklopedia?\n1 - 3/4 = ?",
    options: ["1/4", "2/4", "1/2", "3/4"],
    answer: "1/4", explanation: "1/2 + 1/4 = 3/4. Sisa buku ensiklopedia: 1 - 3/4 = 1/4 bagian.",
    damage: 30, timeLimit: 120,
  },
  {
    level: 7, category: 'fraction_story_advanced', difficulty: 'normal',
    question: "Sebuah drum berisi 3/4 bagian air. Setelah dipakai menyiram bunga 1/2 bagian, drum diisi air hujan 1/4 bagian. Berapa bagian air sekarang?\n1/4 + 1/4 = ?",
    options: ["2/4", "3/4", "1/4", "4/4"],
    answer: "2/4", explanation: "3/4 - 1/2 = 3/4 - 2/4 = 1/4. Lalu ditambah 1/4 = 2/4 (atau 1/2) bagian.",
    damage: 30, timeLimit: 120,
  },
  {
    level: 7, category: 'fraction_story_advanced', difficulty: 'hard',
    question: "Ibu membeli 3 1/2 kg tepung. Dipakai membuat donat 1 1/4 kg dan membuat bakwan 1/2 kg. Berapa kg sisa tepung terigu Ibu?\n2 1/4 - 1/2 = ?",
    options: ["1 3/4", "1 1/2", "2", "1 1/4"],
    answer: "1 3/4", explanation: "3 1/2 - 1 1/4 = 2 1/4. 2 1/4 - 1/2 = 2 1/4 - 2/4 = 1 3/4 kg.",
    damage: 35, timeLimit: 120,
  },
  {
    level: 7, category: 'fraction_story_advanced', difficulty: 'hard',
    question: "Pedagang buah membawa 10 kg jeruk. Terjual 4 1/2 kg di pagi hari dan 3 1/4 kg di siang hari. Berapa kg sisa buah jeruk pedagang?\n10 - 7 3/4 = ?",
    options: ["2 1/4", "2 1/2", "1 3/4", "3 1/4"],
    answer: "2 1/4", explanation: "Total terjual: 4 2/4 + 3 1/4 = 7 3/4. Sisa: 10 - 7 3/4 = 2 1/4 kg.",
    damage: 35, timeLimit: 120,
  },
  {
    level: 7, category: 'fraction_story_advanced', difficulty: 'hard',
    question: "Budi memiliki tabungan. 1/3 bagian digunakan membeli buku dan 1/2 bagian untuk seragam baru. Sisanya disedekahkan ke panti asuhan. Berapa bagian yang disedekahkan?\n1 - 5/6 = ?",
    options: ["1/6", "2/6", "1/3", "1/5"],
    answer: "1/6", explanation: "1/3 + 1/2 = 2/6 + 3/6 = 5/6. Sisa untuk sedekah: 6/6 - 5/6 = 1/6 bagian.",
    damage: 35, timeLimit: 120,
  },

  // ==========================================
  // LEVEL 8: DUEL MASTER PECAHAN (BOSS LEVEL)
  // ==========================================
  {
    level: 8, category: 'fraction_boss', difficulty: 'easy',
    question: "3/5 + 1/5 = ?", options: ["4/5", "4/10", "3/10", "2/5"],
    answer: "4/5", explanation: "Penyebut sama (5), 3 + 1 = 4. Hasil: 4/5.",
    damage: 20, timeLimit: 60,
  },
  {
    level: 8, category: 'fraction_boss', difficulty: 'normal',
    question: "5/6 - 1/3 = ?", options: ["3/6", "4/3", "2/6", "4/6"],
    answer: "3/6", explanation: "5/6 - 2/6 = 3/6 (atau 1/2).",
    damage: 25, timeLimit: 60,
  },
  {
    level: 8, category: 'fraction_boss', difficulty: 'normal',
    question: "1 1/2 + 2 1/3 = ?", options: ["3 5/6", "3 2/5", "4 1/6", "3 1/6"],
    answer: "3 5/6", explanation: "1 + 2 = 3. 3/6 + 2/6 = 5/6. Hasil: 3 5/6.",
    damage: 25, timeLimit: 60,
  },
  {
    level: 8, category: 'fraction_boss', difficulty: 'hard',
    question: "2 1/2 - 3/4 + 1/2 = ?", options: ["2 1/4", "2 1/2", "1 3/4", "2 3/4"],
    answer: "2 1/4", explanation: "2 2/4 - 3/4 = 1 3/4. 1 3/4 + 2/4 = 1 5/4 = 2 1/4.",
    damage: 35, timeLimit: 120,
  },
  {
    level: 8, category: 'fraction_boss', difficulty: 'hard',
    question: "3 1/4 ÷ 1/4 = ?", options: ["13", "12", "14", "15"],
    answer: "13", explanation: "3 1/4 = 13/4. 13/4 × 4/1 = 13.",
    damage: 35, timeLimit: 120,
  },
  {
    level: 8, category: 'fraction_boss', difficulty: 'hard',
    question: "Pak Lurah membagikan 8 1/2 kuintal beras kepada 4 posko secara adil. Setiap posko mendapat 2 kuintal, berapa kuintal beras cadangan tersisa?\n8 1/2 - 8 = ?",
    options: ["1/2", "1/4", "3/4", "1"],
    answer: "1/2", explanation: "4 × 2 = 8 kuintal. 8 1/2 - 8 = 1/2 kuintal tersisa.",
    damage: 35, timeLimit: 120,
  },
  {
    level: 8, category: 'fraction_boss', difficulty: 'hard',
    question: "4 2/3 - 1 1/2 = ?", options: ["3 1/6", "3 1/5", "2 5/6", "3 2/3"],
    answer: "3 1/6", explanation: "4 4/6 - 1 3/6 = 3 1/6.",
    damage: 35, timeLimit: 120,
  },
  {
    level: 8, category: 'fraction_boss', difficulty: 'hard',
    question: "1 1/4 × 2/5 = ?", options: ["2/4", "1/2", "3/5", "5/8"],
    answer: "2/4", explanation: "5/4 × 2/5 = 10/20 = 2/4 (atau 1/2).",
    damage: 35, timeLimit: 120,
  },
];

let idCounter = 1;
const questionsWithIds = rawQuestions.map((q) => ({
  id: idCounter++,
  ...q,
}));

const fileContent = `import type { Question } from '../types/game';

export const QUESTIONS: Question[] = ${JSON.stringify(questionsWithIds, null, 2)};

export function getQuestionsByLevel(levelId: number): Question[] {
  return QUESTIONS.filter((q) => q.level === levelId);
}
`;

fs.writeFileSync(targetPath, fileContent, 'utf-8');
console.log(`Generated ${questionsWithIds.length} questions into ${targetPath}`);
