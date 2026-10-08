import type { IconDescriptor } from "@/components/klinik/ui/iconDescriptor";

export type FasilitasItem = {
  title: string;
  body: string;
  icon: IconDescriptor;
};

export const fasilitasUmum: FasilitasItem[] = [
  {
    title: "Administrasi",
    body: "Loket pendaftaran, informasi, dan pembayaran pasien.",
    icon: { kind: "lucide", name: "clipboardList" },
  },
  {
    title: "Ruang Tunggu",
    body: "Area menunggu yang nyaman dengan fasilitas dasar.",
    icon: { kind: "lucide", name: "clock" },
  },
  {
    title: "Ruang Menyusui",
    body: "Ruang privat untuk ibu menyusui dengan kenyamanan memadai.",
    icon: { kind: "lucide", name: "baby" },
  },
  {
    title: "Ruang Praktik Dokter",
    body: "Tempat dokter melakukan pemeriksaan dan konsultasi.",
    icon: { kind: "lucide", name: "stethoscope" },
  },
  {
    title: "Toilet",
    body: "Toilet bersih dengan fasilitas kebersihan lengkap.",
    icon: { kind: "lucideCircle", name: "toilet", tone: "blue" },
  },
];

export const fasilitasLainnya: FasilitasItem[] = [
  {
    title: "Handsanitizer",
    body: "Tersedia di berbagai titik untuk menjaga kebersihan tangan pengunjung.",
    icon: { kind: "lucideCircle", name: "droplets", tone: "mint" },
  },
  {
    title: "Pemadam Api (APAR)",
    body: "Peralatan keselamatan untuk penanganan darurat kebakaran.",
    icon: { kind: "lucideCircle", name: "flame", tone: "red" },
  },
  {
    title: "CCTV",
    body: "Sistem kamera pengawas untuk keamanan seluruh area klinik.",
    icon: { kind: "lucide", name: "cctv" },
  },
  {
    title: "Zona Bebas Rokok",
    body: "Area klinik sepenuhnya bebas rokok demi kenyamanan dan kesehatan bersama.",
    icon: { kind: "lucide", name: "cigaretteOff" },
  },
];
