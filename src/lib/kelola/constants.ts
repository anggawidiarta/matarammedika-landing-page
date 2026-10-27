import type { KlinikLucideName } from "@/types/feature";

export { CIRCLE_TONES, KLINIK_ICON_NAMES } from "@/types/feature";

export const CMS_ITEMS_TABLE = "cms_items";
export const CMS_INSTAGRAM_TABLE = "cms_promo_instagram_posts";

export const TITLE_MAX = 120;
export const BODY_MAX = 1000;

export const PROMO_IMAGE_BUCKET = "Klinik";
export const PROMO_IMAGE_DIR = "cms/promo";
export const PROMO_IMAGE_MAX_BYTES = 2 * 1024 * 1024;
export const PROMO_IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export const INSTAGRAM_IMAGE_DIR = "cms/promo/instagram";
export const INSTAGRAM_IMAGE_MAX_BYTES = 2 * 1024 * 1024;
export const INSTAGRAM_CAPTION_MAX = 2200;
export const INSTAGRAM_HASHTAG_MAX = 30;
export const INSTAGRAM_STALE_PUBLISHING_MS = 5 * 60 * 1000;
export const INSTAGRAM_ERROR_MAX = 500;

export const MODULES = ["layanan", "fasilitas", "promo", "profil"] as const;
export type CmsModule = (typeof MODULES)[number];

export const SOURCES = [
  { label: "Klinik", value: "klinik" },
  { label: "Apotek", value: "apotek" },
] as const;
export type CmsSource = (typeof SOURCES)[number]["value"];

export const SECTIONS_BY_MODULE = {
  layanan: [
    { label: "Umum / Gigi", value: "umum_gigi" },
    { label: "Spesialis", value: "spesialis" },
  ],
  fasilitas: [
    { label: "Fasilitas Umum", value: "umum" },
    { label: "Fasilitas Lainnya", value: "lainnya" },
  ],
  profil: [
    { label: "Tentang Kami", value: "tentang" },
    { label: "Visi", value: "visi" },
    { label: "Misi", value: "misi" },
  ],
  promo: [],
} as const satisfies Record<CmsModule, readonly { label: string; value: string }[]>;

export const MODULE_LABELS: Record<CmsModule, string> = {
  layanan: "Layanan",
  fasilitas: "Fasilitas",
  profil: "Profil",
  promo: "Promo",
};

export const MODULE_SITE_PATHS: Record<CmsModule, string> = {
  layanan: "/layanan-klinik",
  fasilitas: "/fasilitas-klinik",
  profil: "/profil-klinik",
  promo: "/promo-klinik",
};

export function sectionValues(module: CmsModule): readonly string[] {
  return SECTIONS_BY_MODULE[module].map((section) => section.value);
}

export const ICON_LABELS: Record<KlinikLucideName, string> = {
  activity: "Aktivitas / Penyakit dalam",
  baby: "Anak / Bayi",
  brain: "Saraf",
  brainCircuit: "Kejiwaan",
  cctv: "CCTV",
  cigaretteOff: "Bebas rokok",
  clipboardList: "Administrasi",
  clock: "Waktu tunggu",
  droplets: "Kebersihan",
  ear: "THT",
  flame: "Pemadam api",
  heartPulse: "Denyut jantung",
  lungs: "Paru-paru",
  sparkles: "Kulit / Estetika",
  stethoscope: "Pemeriksaan dokter",
  toilet: "Toilet",
  tooth: "Gigi",
  userSearch: "Cari pasien",
  pill: "Obat",
  syringe: "Suntik / Imunisasi",
  microscope: "Laboratorium",
  flask: "Lab / Tes",
  testTube: "Sampel",
  dna: "Genetik",
  eye: "Mata",
  glasses: "Kacamata",
  bone: "Tulang",
  footprints: "Rehabilitasi",
  heart: "Jantung",
  thermometer: "Suhu / Demam",
  bandage: "Perban / Luka",
  radiation: "Rontgen",
  scanLine: "Pemindaian",
  venus: "Kesehatan wanita",
  handHeart: "Perawatan",
  hand: "Cuci tangan",
  apple: "Gizi",
  ambulance: "Ambulans",
  siren: "Gawat darurat",
  hospital: "Klinik",
  building: "Gedung",
  bed: "Rawat inap",
  wheelchair: "Akses difabel",
  armchair: "Kursi",
  sofa: "Ruang tunggu",
  coffee: "Kafetaria",
  utensils: "Makan",
  parking: "Parkir",
  car: "Kendaraan",
  mapPin: "Lokasi",
  doorOpen: "Pintu masuk",
  wifi: "Wi-Fi",
  snowflake: "AC",
  fan: "Ventilasi",
  lock: "Keamanan",
  shieldCheck: "Terjamin",
  bath: "Kamar mandi",
  showerHead: "Shower",
  moon: "24 jam",
  users: "Pasien / Keluarga",
  phone: "Kontak",
  creditCard: "Pembayaran",
  wallet: "Biaya",
  fileText: "Dokumen",
  clipboardCheck: "Pemeriksaan",
  ban: "Dilarang",
};
