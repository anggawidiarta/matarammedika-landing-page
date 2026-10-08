import type { IconDescriptor } from "@/components/klinik/ui/iconDescriptor";

export type LayananItem = {
  title: string;
  body: string;
  icon: IconDescriptor;
};

export const layananUmumGigi: {
  umum: LayananItem;
  gigi: LayananItem;
} = {
  umum: {
    title: "Umum",
    body: "Menangani keluhan gigi dan mulut seperti pencabutan, penambalan, pembersihan karang gigi, dan konsultasi kesehatan gigi.",
    icon: { kind: "lucideCircle", name: "heartPulse", tone: "blue" },
  },
  gigi: {
    title: "Gigi",
    body: "Pelayanan pemeriksaan kesehatan dasar, konsultasi keluhan umum, dan tindakan medis ringan.",
    icon: { kind: "lucide", name: "tooth" },
  },
};

export const layananSpecialists: LayananItem[] = [
  {
    title: "Spesialis Anak",
    body: "Perawatan bayi, balita, dan anak, termasuk pemeriksaan rutin, penanganan penyakit umum, pemantauan tumbuh kembang, dan imunisasi.",
    icon: { kind: "lucide", name: "baby" },
  },
  {
    title: "Spesialis Kandungan",
    body: "Layanan pemeriksaan kehamilan, kesehatan reproduksi wanita, deteksi dini gangguan kehamilan, USG, serta konsultasi terkait kehamilan dan fertilitas.",
    icon: { kind: "lucideCircle", name: "baby", tone: "green" },
  },
  {
    title: "Spesialis Kulit & Kelamin",
    body: "Menangani masalah kulit, alergi, infeksi menular, serta konsultasi estetika dasar.",
    icon: { kind: "lucideCircle", name: "sparkles", tone: "pink" },
  },
  {
    title: "Spesialis THT",
    body: "Pelayanan khusus untuk menangani gangguan telinga, hidung, dan tenggorokan, termasuk infeksi, alergi, gangguan pendengaran, sinusitis.",
    icon: { kind: "lucideCircle", name: "ear", tone: "lilac" },
  },
  {
    title: "Spesialis Saraf",
    body: "pemeriksaan dan penanganan gangguan sistem saraf, seperti sakit kepala kronis, stroke, kejang, neuropati, gangguan gerak.",
    icon: { kind: "lucide", name: "brain" },
  },
  {
    title: "Spesialis Kejiwaan",
    body: "Menangani masalah kesehatan mental seperti kecemasan, depresi, stres berat, gangguan tidur, trauma, serta penilaian kondisi psikologis.",
    icon: { kind: "lucide", name: "brainCircuit" },
  },
  {
    title: "Spesialis Penyakit Dalam",
    body: "Menangani berbagai gangguan kesehatan pada organ dalam seperti diabetes, hipertensi, maag kronis, infeksi, gangguan metabolik, serta penyakit kronis lainnya pada dewasa.",
    icon: { kind: "lucide", name: "activity" },
  },
  {
    title: "Spesialis Paru-Paru",
    body: "Layanan pemeriksaan dan penanganan gangguan pernapasan seperti asma, pneumonia, TBC, infeksi saluran napas, PPOK, serta masalah kesehatan paru lainnya.",
    icon: { kind: "lucide", name: "lungs" },
  },
];

/** First six specialists — preview on home */
export const layananHomePreview = layananSpecialists.slice(0, 6);
