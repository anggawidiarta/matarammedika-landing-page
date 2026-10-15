import rawAulia from "@/assets/dokter/aulia-dalila.webp";
import rawBunga from "@/assets/dokter/bunga-nurmalita.webp";
import rawDewi from "@/assets/dokter/dewi-gotama.webp";
import rawDhesty from "@/assets/dokter/dhesty-dadhilah.webp";
import rawElly from "@/assets/dokter/elly-rosila-wijaya.webp";
import rawFebrina from "@/assets/dokter/febrina-rambu.webp";
import rawKristopher from "@/assets/dokter/kristopher-pamudji.webp";
import rawMusa from "@/assets/dokter/musa-taufiq.webp";
import rawNila from "@/assets/dokter/nila-febriana.webp";
import rawOutline from "@/assets/dokter/outline.svg";
import rawPanji from "@/assets/dokter/panji-syabila.webp";
import rawRico from "@/assets/dokter/rico-novyanto.webp";
import rawSlamet from "@/assets/dokter/slamet-tjahjono.webp";
import rawZainul from "@/assets/dokter/zainul-mujahid.webp";

export const doctorOutline = rawOutline.src;

export type DoctorProfile = {
  name: string;
  specialty: string;
  card: string;
};

export const clinicDoctors: DoctorProfile[] = [
  {
    name: "dr. Kristopher May Pamudji, Sp.A",
    specialty: "Spesialis Anak",
    card: rawKristopher.src,
  },
  {
    name: "dr. Musa Taufiq, Sp.OG",
    specialty: "Spesialis Kandungan",
    card: rawMusa.src,
  },
  {
    name: "dr. Dewi Gotama, Sp.D.V.E",
    specialty: "Spesialis Kulit, Kelamin & Estetika",
    card: rawDewi.src,
  },
  {
    name: "dr. Zainul Mujahid, Sp.T.H.T.B.K.L",
    specialty: "Spesialis THT, Bedah Kepala & Leher",
    card: rawZainul.src,
  },
  {
    name: "drg. Bunga Nurmalita",
    specialty: "Gigi",
    card: rawBunga.src,
  },
  {
    name: "drg. Aulia Dalila",
    specialty: "Gigi",
    card: rawAulia.src,
  },
  {
    name: "drg. M. Panji Syabila Abd Majid",
    specialty: "Gigi",
    card: rawPanji.src,
  },
  {
    name: "dr. Rico Novyanto, Sp.PD, FINASIM",
    specialty: "Spesialis Penyakit Dalam",
    card: rawRico.src,
  },
  {
    name: "dr. Slamet Tjahjono, Sp.P(K), FISR",
    specialty: "Spesialis Paru, Konsultan Infeksi Paru",
    card: rawSlamet.src,
  },
  {
    name: "dr. Elly Rosila Wijaya, Sp.K.J, M.M",
    specialty: "Spesialis Kesehatan Jiwa",
    card: rawElly.src,
  },
  {
    name: "dr. Febrina Rambu, Sp.N, AIFO-K",
    specialty: "Spesialis Neurologi",
    card: rawFebrina.src,
  },
  {
    name: "dr. Nila Febriana Iswara",
    specialty: "Umum",
    card: rawNila.src,
  },
  {
    name: "dr. Dhesty Dadhilah Faatin",
    specialty: "Umum",
    card: rawDhesty.src,
  },
];
